import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateEjercicioDto } from './dto/create-ejercicio.dto';
import { UpdateEjercicioDto } from './dto/update-ejercicio.dto';
import { FindEjerciciosQueryDto } from './dto/find-ejercicios-query.dto';
import { ValidarEjercicioDto } from './dto/validar-ejercicio.dto';

@Injectable()
export class EjerciciosService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(query: FindEjerciciosQueryDto) {
    const where = {
      ...(query.categoria ? { categoria: query.categoria } : {}),
      ...(query.dificultad ? { dificultad: query.dificultad } : {}),
    };

    return this.prisma.ejercicio.findMany({
      where,
      orderBy: { idEjercicio: 'asc' },
      take: query.limit ?? 50,
    });
  }

  async findOne(idEjercicio: number) {
    const ejercicio = await this.prisma.ejercicio.findUnique({
      where: { idEjercicio },
    });

    if (!ejercicio) {
      throw new NotFoundException('Ejercicio no encontrado');
    }

    return ejercicio;
  }

  create(dto: CreateEjercicioDto) {
    return this.prisma.ejercicio.create({
      data: dto,
    });
  }

  async update(idEjercicio: number, dto: UpdateEjercicioDto) {
    await this.findOne(idEjercicio);

    return this.prisma.ejercicio.update({
      where: { idEjercicio },
      data: dto,
    });
  }

  async remove(idEjercicio: number) {
    await this.findOne(idEjercicio);

    await this.prisma.ejercicio.delete({
      where: { idEjercicio },
    });

    return { message: 'Ejercicio eliminado correctamente' };
  }

  async validarRespuesta(idEjercicio: number, dto: ValidarEjercicioDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { idUsuario: dto.idUsuario },
      select: { idUsuario: true },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const ejercicio = await this.prisma.ejercicio.findUnique({
      where: { idEjercicio },
      include: {
        solucion: {
          select: { patronValidacion: true },
        },
      },
    });

    if (!ejercicio) {
      throw new NotFoundException('Ejercicio no encontrado');
    }

    if (!ejercicio.solucion?.patronValidacion) {
      throw new BadRequestException('El ejercicio no tiene patrón de validación configurado');
    }

    const patron = ejercicio.solucion.patronValidacion;
    const esCorrecto = this.evaluarRespuesta(dto.respuesta, patron);

    const intento = await this.prisma.intento.create({
      data: {
        idUsuario: dto.idUsuario,
        idEjercicio,
        respuesta: dto.respuesta,
        esCorrecto,
      },
      select: {
        idIntento: true,
        fecha: true,
        esCorrecto: true,
      },
    });

    return {
      ejercicioId: idEjercicio,
      usuarioId: dto.idUsuario,
      esCorrecto,
      feedback: esCorrecto
        ? 'Respuesta correcta. Buen trabajo.'
        : 'Respuesta incorrecta. Revisa la lógica e intenta de nuevo.',
      intento,
    };
  }

  private evaluarRespuesta(respuesta: string, patronValidacion: string): boolean {
    const respuestaNormalizada = this.normalizarTexto(respuesta);
    const patronNormalizado = patronValidacion.trim();

    const regexLiteral = patronNormalizado.match(/^\/(.*)\/([gimsuy]*)$/);

    if (regexLiteral) {
      const [, pattern, flags] = regexLiteral;
      try {
        const regex = new RegExp(pattern, flags);
        return regex.test(respuesta);
      } catch {
        throw new BadRequestException('El patrón de validación regex es inválido');
      }
    }

    return respuestaNormalizada === this.normalizarTexto(patronNormalizado);
  }

  private normalizarTexto(texto: string): string {
    return texto
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
  }
}
