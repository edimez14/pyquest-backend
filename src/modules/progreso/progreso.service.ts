import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { FindProgresoQueryDto } from './dto/find-progreso-query.dto';
import { UpsertProgresoDto } from './dto/upsert-progreso.dto';

@Injectable()
export class ProgresoService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query: FindProgresoQueryDto) {
    return this.prisma.progresoUsuario.findMany({
      where: {
        idUsuario: query.idUsuario,
        ...(query.completado !== undefined ? { completado: query.completado } : {}),
      },
      include: {
        ejercicio: {
          select: {
            idEjercicio: true,
            titulo: true,
            categoria: true,
            dificultad: true,
          },
        },
      },
      orderBy: { idProgreso: 'asc' },
    });
  }

  async findOne(idProgreso: number) {
    const progreso = await this.prisma.progresoUsuario.findUnique({
      where: { idProgreso },
      include: {
        usuario: {
          select: {
            idUsuario: true,
            nombre: true,
            email: true,
          },
        },
        ejercicio: {
          select: {
            idEjercicio: true,
            titulo: true,
            categoria: true,
            dificultad: true,
          },
        },
      },
    });

    if (!progreso) {
      throw new NotFoundException('Progreso no encontrado');
    }

    return progreso;
  }

  async upsert(dto: UpsertProgresoDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { idUsuario: dto.idUsuario },
      select: { idUsuario: true },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const ejercicio = await this.prisma.ejercicio.findUnique({
      where: { idEjercicio: dto.idEjercicio },
      select: { idEjercicio: true },
    });

    if (!ejercicio) {
      throw new NotFoundException('Ejercicio no encontrado');
    }

    return this.prisma.progresoUsuario.upsert({
      where: {
        idUsuario_idEjercicio: {
          idUsuario: dto.idUsuario,
          idEjercicio: dto.idEjercicio,
        },
      },
      create: {
        idUsuario: dto.idUsuario,
        idEjercicio: dto.idEjercicio,
        completado: dto.completado,
      },
      update: {
        completado: dto.completado,
      },
      include: {
        ejercicio: {
          select: {
            idEjercicio: true,
            titulo: true,
          },
        },
      },
    });
  }

  async remove(idProgreso: number) {
    await this.findOne(idProgreso);

    await this.prisma.progresoUsuario.delete({
      where: { idProgreso },
    });

    return { message: 'Progreso eliminado correctamente' };
  }
}
