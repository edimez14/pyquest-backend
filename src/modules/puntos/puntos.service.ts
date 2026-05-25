import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { DificultadEjercicio } from '@prisma/client';

// Puntos otorgados segun la dificultad del ejercicio
const PUNTOS_POR_DIFICULTAD: Record<DificultadEjercicio, number> = {
  BAJO: 10,
  MEDIO: 25,
  ALTO: 50,
};

@Injectable()
export class PuntosService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Devuelve los puntos actuales del usuario.
   */
  async obtenerPuntos(idUsuario: number): Promise<{ puntos: number }> {
    const perfil = await this.prisma.perfil.findUnique({
      where: { idUsuario },
      select: { puntos: true },
    });

    if (!perfil) {
      throw new NotFoundException('Perfil no encontrado para el usuario');
    }

    return { puntos: perfil.puntos };
  }

  /**
   * Devuelve el historial de transacciones de puntos del usuario.
   */
  async obtenerHistorial(idUsuario: number) {
    return this.prisma.transaccionPuntos.findMany({
      where: { idUsuario },
      orderBy: { fecha: 'desc' },
      take: 100,
    });
  }

  /**
   * Otorga puntos al usuario por completar correctamente un ejercicio.
   * Retorna los puntos otorgados.
   */
  async otorgarPuntos(
    idUsuario: number,
    dificultad: DificultadEjercicio,
    idEjercicio: number,
  ): Promise<{ puntosOtorgados: number }> {
    const puntosOtorgados = PUNTOS_POR_DIFICULTAD[dificultad];

    // Actualizar puntos del perfil y registrar la transaccion en una sola operacion
    await this.prisma.$transaction([
      this.prisma.perfil.update({
        where: { idUsuario },
        data: { puntos: { increment: puntosOtorgados } },
      }),
      this.prisma.transaccionPuntos.create({
        data: {
          idUsuario,
          cantidad: puntosOtorgados,
          tipo: 'ejercicio_completado',
          descripcion: `Ejercicio ${idEjercicio} (${dificultad})`,
          idEjercicio,
        },
      }),
    ]);

    return { puntosOtorgados };
  }

  /**
   * Deduce puntos al usuario por una compra en la tienda.
   * Lanza BadRequestException si no tiene puntos suficientes.
   */
  async gastarPuntos(
    idUsuario: number,
    cantidad: number,
    descripcion: string,
  ): Promise<{ puntosRestantes: number }> {
    // Verificar puntos actuales dentro de una transaccion para evitar race conditions
    const resultado = await this.prisma.$transaction(async (trx) => {
      const perfil = await trx.perfil.findUnique({
        where: { idUsuario },
        select: { puntos: true, idPerfil: true },
      });

      if (!perfil) {
        throw new NotFoundException('Perfil no encontrado para el usuario');
      }

      if (perfil.puntos < cantidad) {
        throw new BadRequestException(
          `Puntos insuficientes. Tienes ${perfil.puntos}, necesitas ${cantidad}.`,
        );
      }

      await trx.perfil.update({
        where: { idUsuario },
        data: { puntos: { decrement: cantidad } },
      });

      await trx.transaccionPuntos.create({
        data: {
          idUsuario,
          cantidad: -cantidad,
          tipo: 'tienda_canje',
          descripcion,
        },
      });

      return { puntosRestantes: perfil.puntos - cantidad };
    });

    return resultado;
  }
}
