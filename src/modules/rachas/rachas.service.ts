import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RachasResponseDto } from './dto/rachas-response.dto';

@Injectable()
export class RachasService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene todas las rachas del usuario autenticado.
   */
  async obtenerRachas(idUsuario: number): Promise<RachasResponseDto> {
    const perfil = await this.prisma.perfil.findUnique({
      where: { idUsuario },
      select: {
        rachaDiaria: true,
        rachaDiariaMax: true,
        rachaConsecutiva: true,
        rachaConsecutivaMax: true,
        inicioRachaDiaria: true,
        inicioRachaConsecutiva: true,
        fechaUltimoEjercicio: true,
      },
    });

    if (!perfil) {
      throw new NotFoundException('Perfil no encontrado para el usuario');
    }

    return {
      rachaDiaria: perfil.rachaDiaria,
      rachaDiariaMax: perfil.rachaDiariaMax,
      rachaConsecutiva: perfil.rachaConsecutiva,
      rachaConsecutivaMax: perfil.rachaConsecutivaMax,
      inicioRachaDiaria: perfil.inicioRachaDiaria,
      inicioRachaConsecutiva: perfil.inicioRachaConsecutiva,
      fechaUltimoEjercicio: perfil.fechaUltimoEjercicio,
    };
  }

  /**
   * Actualiza las rachas del usuario cuando responde un ejercicio.
   * Se llama desde EjerciciosService.validarRespuesta.
   */
  async actualizarRachas(
    idUsuario: number,
    esCorrecto: boolean,
  ): Promise<void> {
    const ahora = new Date();

    // Actualizar racha consecutiva (basada en aciertos seguidos)
    if (esCorrecto) {
      await this.incrementarRachaConsecutiva(idUsuario, ahora);
    } else {
      await this.reiniciarRachaConsecutiva(idUsuario, ahora);
    }

    // Actualizar racha diaria (basada en ejercicios por dia)
    if (esCorrecto) {
      await this.actualizarRachaDiaria(idUsuario, ahora);
    }

    // Siempre actualizar el timestamp de ultima actualizacion
    await this.prisma.perfil.update({
      where: { idUsuario },
      data: { ultimaActualizacionRachas: ahora },
    });
  }

  /**
   * Incrementa la racha consecutiva (respuesta correcta).
   * Si es la primera vez, inicia en 1.
   */
  private async incrementarRachaConsecutiva(
    idUsuario: number,
    ahora: Date,
  ): Promise<void> {
    const perfil = await this.prisma.perfil.findUnique({
      where: { idUsuario },
      select: { rachaConsecutiva: true, rachaConsecutivaMax: true },
    });

    if (!perfil) return;

    const nuevaRacha = perfil.rachaConsecutiva + 1;
    const nuevoMax = Math.max(nuevaRacha, perfil.rachaConsecutivaMax);

    await this.prisma.perfil.update({
      where: { idUsuario },
      data: {
        rachaConsecutiva: nuevaRacha,
        rachaConsecutivaMax: nuevoMax,
        inicioRachaConsecutiva: perfil.rachaConsecutiva === 0
          ? ahora
          : undefined, // mantiene el inicio si ya habia racha
      },
    });
  }

  /**
   * Reinicia la racha consecutiva a 0 (respuesta incorrecta).
   */
  private async reiniciarRachaConsecutiva(
    idUsuario: number,
    ahora: Date,
  ): Promise<void> {
    await this.prisma.perfil.update({
      where: { idUsuario },
      data: {
        rachaConsecutiva: 0,
        inicioRachaConsecutiva: null,
      },
    });
  }

  /**
   * Actualiza la racha diaria basada en la fecha actual.
   * Reglas:
   * - Sin ejercicios previos: inicia en 1
   * - Mismo dia: no cambia (ya se contó)
   * - Dia consecutivo (ayer): incrementa
   * - Mas de un dia de diferencia: reinicia a 1
   */
  private async actualizarRachaDiaria(
    idUsuario: number,
    ahora: Date,
  ): Promise<void> {
    const perfil = await this.prisma.perfil.findUnique({
      where: { idUsuario },
      select: {
        rachaDiaria: true,
        rachaDiariaMax: true,
        fechaUltimoEjercicio: true,
      },
    });

    if (!perfil) return;

    const hoy = this.fechaSinHora(ahora);
    let nuevaRacha: number;
    let mantenerInicio: boolean;

    if (!perfil.fechaUltimoEjercicio) {
      // Primer ejercicio jamas
      nuevaRacha = 1;
      mantenerInicio = false;
    } else {
      const ultimoDia = this.fechaSinHora(perfil.fechaUltimoEjercicio);
      const diffDias = this.diferenciaEnDias(ultimoDia, hoy);

      if (diffDias === 0) {
        // Ya hizo ejercicio hoy, no cambia la racha
        nuevaRacha = perfil.rachaDiaria;
        mantenerInicio = true;
      } else if (diffDias === 1) {
        // Dia consecutivo, incrementa
        nuevaRacha = perfil.rachaDiaria + 1;
        mantenerInicio = true;
      } else {
        // Mas de un dia sin ejercicios, reinicia
        nuevaRacha = 1;
        mantenerInicio = false;
      }
    }

    const nuevoMax = Math.max(nuevaRacha, perfil.rachaDiariaMax);

    await this.prisma.perfil.update({
      where: { idUsuario },
      data: {
        rachaDiaria: nuevaRacha,
        rachaDiariaMax: nuevoMax,
        fechaUltimoEjercicio: ahora,
        inicioRachaDiaria: mantenerInicio
          ? undefined // mantiene el valor existente
          : ahora,
      },
    });
  }

  /**
   * Retorna una fecha sin componente de hora (solo año, mes, dia).
   */
  fechaSinHora(fecha: Date): Date {
    return new Date(Date.UTC(
      fecha.getUTCFullYear(),
      fecha.getUTCMonth(),
      fecha.getUTCDate(),
    ));
  }

  /**
   * Calcula la diferencia en dias entre dos fechas (positivo si fecha2 > fecha1).
   */
  diferenciaEnDias(fecha1: Date, fecha2: Date): number {
    const msPorDia = 1000 * 60 * 60 * 24;
    return Math.floor((fecha2.getTime() - fecha1.getTime()) / msPorDia);
  }
}
