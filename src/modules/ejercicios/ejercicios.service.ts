import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateEjercicioDto } from './dto/create-ejercicio.dto';
import { UpdateEjercicioDto } from './dto/update-ejercicio.dto';
import { FindEjerciciosQueryDto } from './dto/find-ejercicios-query.dto';
import { ValidarEjercicioDto } from './dto/validar-ejercicio.dto';
import { RachasService } from '../rachas/rachas.service';
import { PuntosService } from '../puntos/puntos.service';
import { PistasService } from './pistas.service';

@Injectable()
export class EjerciciosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rachasService: RachasService,
    private readonly puntosService: PuntosService,
    private readonly pistasService: PistasService,
  ) { }

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

  async create(dto: CreateEjercicioDto) {
    const { pistas, ...ejercicioData } = dto;

    const ejercicio = await this.prisma.ejercicio.create({
      data: ejercicioData,
    });

    // Crear las 3 pistas asociadas al ejercicio
    await this.pistasService.createPistas(ejercicio.idEjercicio, pistas);

    return { ...ejercicio, pistas };
  }

  async update(idEjercicio: number, dto: UpdateEjercicioDto) {
    await this.findOne(idEjercicio);

    const { pistas, ...ejercicioData } = dto;

    const ejercicio = await this.prisma.ejercicio.update({
      where: { idEjercicio },
      data: ejercicioData,
    });

    // Si se enviaron pistas, reemplazarlas
    if (pistas) {
      await this.pistasService.replacePistas(idEjercicio, pistas);
    }

    return { ...ejercicio, ...(pistas && { pistas }) };
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

    // Actualizar rachas del usuario segun el resultado
    await this.rachasService.actualizarRachas(dto.idUsuario, esCorrecto);

    // Otorgar puntos si la respuesta fue correcta
    let puntosOtorgados = 0;
    if (esCorrecto) {
      const resultado = await this.puntosService.otorgarPuntos(
        dto.idUsuario,
        ejercicio.dificultad,
        idEjercicio,
      );
      puntosOtorgados = resultado.puntosOtorgados;
    }

    return {
      ejercicioId: idEjercicio,
      usuarioId: dto.idUsuario,
      esCorrecto,
      puntosOtorgados,
      feedback: esCorrecto
        ? `Respuesta correcta. +${puntosOtorgados} puntos. Buen trabajo.`
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
