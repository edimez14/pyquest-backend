import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { FindQuizQueryDto } from './dto/find-quiz-query.dto';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { ResponderQuizDto } from './dto/responder-quiz.dto';

@Injectable()
export class QuizService {
  constructor(private readonly prisma: PrismaService) { }

  findAll(query: FindQuizQueryDto) {
    return this.prisma.quiz.findMany({
      where: query.search
        ? {
          OR: [
            { titulo: { contains: query.search, mode: 'insensitive' } },
            { descripcion: { contains: query.search, mode: 'insensitive' } },
          ],
        }
        : undefined,
      include: {
        _count: {
          select: { preguntas: true },
        },
      },
      orderBy: { idQuiz: 'asc' },
      take: query.limit ?? 50,
    });
  }

  async findOne(idQuiz: number) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { idQuiz },
      include: {
        preguntas: {
          include: {
            respuestas: true,
          },
          orderBy: { idPregunta: 'asc' },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz no encontrado');
    }

    return quiz;
  }

  async create(dto: CreateQuizDto) {
    this.validarPreguntas(dto.preguntas);

    return this.prisma.quiz.create({
      data: {
        titulo: dto.titulo,
        descripcion: dto.descripcion ?? '',
        preguntas: {
          create: dto.preguntas.map((pregunta) => ({
            enunciado: pregunta.enunciado,
            respuestas: {
              create: pregunta.respuestas,
            },
          })),
        },
      },
      include: {
        preguntas: {
          include: {
            respuestas: true,
          },
        },
      },
    });
  }

  async update(idQuiz: number, dto: UpdateQuizDto) {
    await this.findOne(idQuiz);

    if (dto.preguntas) {
      this.validarPreguntas(dto.preguntas);
    }

    return this.prisma.$transaction(async (trx) => {
      await trx.quiz.update({
        where: { idQuiz },
        data: {
          ...(dto.titulo ? { titulo: dto.titulo } : {}),
          ...(dto.descripcion !== undefined ? { descripcion: dto.descripcion } : {}),
        },
      });

      if (dto.preguntas) {
        await trx.respuesta.deleteMany({
          where: {
            pregunta: {
              idQuiz,
            },
          },
        });

        await trx.pregunta.deleteMany({
          where: { idQuiz },
        });

        await trx.pregunta.createMany({
          data: dto.preguntas.map((pregunta) => ({
            idQuiz,
            enunciado: pregunta.enunciado,
          })),
        });

        const preguntasCreadas = await trx.pregunta.findMany({
          where: { idQuiz },
          orderBy: { idPregunta: 'asc' },
        });

        const respuestasData = dto.preguntas.flatMap((pregunta, index) =>
          pregunta.respuestas.map((respuesta) => ({
            idPregunta: preguntasCreadas[index].idPregunta,
            texto: respuesta.texto,
            esCorrecta: respuesta.esCorrecta,
          })),
        );

        await trx.respuesta.createMany({
          data: respuestasData,
        });
      }

      return trx.quiz.findUnique({
        where: { idQuiz },
        include: {
          preguntas: {
            include: {
              respuestas: true,
            },
            orderBy: { idPregunta: 'asc' },
          },
        },
      });
    });
  }

  async remove(idQuiz: number) {
    await this.findOne(idQuiz);

    await this.prisma.quiz.delete({
      where: { idQuiz },
    });

    return { message: 'Quiz eliminado correctamente' };
  }

  async responder(idQuiz: number, dto: ResponderQuizDto) {
    const quiz = await this.findOne(idQuiz);

    const preguntasMap = new Map(
      quiz.preguntas.map((pregunta) => [pregunta.idPregunta, pregunta]),
    );

    let correctas = 0;
    const detalle = dto.respuestas.map((item) => {
      const pregunta = preguntasMap.get(item.idPregunta);

      if (!pregunta) {
        throw new BadRequestException(`La pregunta ${item.idPregunta} no pertenece al quiz`);
      }

      const respuestaSeleccionada = pregunta.respuestas.find(
        (respuesta) => respuesta.idRespuesta === item.idRespuesta,
      );

      if (!respuestaSeleccionada) {
        throw new BadRequestException(
          `La respuesta ${item.idRespuesta} no pertenece a la pregunta ${item.idPregunta}`,
        );
      }

      if (respuestaSeleccionada.esCorrecta) {
        correctas += 1;
      }

      return {
        idPregunta: item.idPregunta,
        idRespuesta: item.idRespuesta,
        esCorrecta: respuestaSeleccionada.esCorrecta,
      };
    });

    const totalRespondidas = dto.respuestas.length;
    const porcentaje = totalRespondidas > 0 ? Math.round((correctas / totalRespondidas) * 100) : 0;

    return {
      idQuiz,
      totalRespondidas,
      correctas,
      incorrectas: totalRespondidas - correctas,
      porcentaje,
      detalle,
    };
  }

  private validarPreguntas(
    preguntas: Array<{ respuestas: Array<{ esCorrecta: boolean }> }>,
  ) {
    preguntas.forEach((pregunta, index) => {
      const respuestasCorrectas = pregunta.respuestas.filter(
        (respuesta) => respuesta.esCorrecta,
      );

      if (respuestasCorrectas.length !== 1) {
        throw new BadRequestException(
          `La pregunta ${index + 1} debe tener exactamente una respuesta correcta`,
        );
      }
    });
  }
}
