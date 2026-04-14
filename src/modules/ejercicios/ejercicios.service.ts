import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateEjercicioDto } from './dto/create-ejercicio.dto';
import { UpdateEjercicioDto } from './dto/update-ejercicio.dto';
import { FindEjerciciosQueryDto } from './dto/find-ejercicios-query.dto';

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
}
