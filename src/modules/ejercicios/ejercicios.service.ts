import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateEjercicioDto } from './dto/create-ejercicio.dto';
import { UpdateEjercicioDto } from './dto/update-ejercicio.dto';
import { FindEjerciciosQueryDto } from './dto/find-ejercicios-query.dto';
import { ValidarEjercicioDto } from './dto/validar-ejercicio.dto';
import { RachasService } from '../rachas/rachas.service';
import { PuntosService } from '../puntos/puntos.service';
import { PistasService } from './pistas.service';
import { CompilerService } from '../compiler/compiler.service';

@Injectable()
export class EjerciciosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rachasService: RachasService,
    private readonly puntosService: PuntosService,
    private readonly pistasService: PistasService,
    private readonly compilerService: CompilerService,
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
    const { pistas, patronValidacion, outputEsperado, stdin, ...ejercicioData } = dto;

    const ejercicio = await this.prisma.ejercicio.create({
      data: ejercicioData,
    });

    // Crear la solución asociada (output o regex)
    if (patronValidacion || outputEsperado) {
      await this.prisma.solucion.create({
        data: {
          idEjercicio: ejercicio.idEjercicio,
          patronValidacion: patronValidacion ?? '',
          outputEsperado: outputEsperado ?? null,
          stdin: stdin ?? null,
        },
      });
    }

    // Crear las 3 pistas asociadas al ejercicio
    await this.pistasService.createPistas(ejercicio.idEjercicio, pistas);

    return { ...ejercicio, pistas };
  }

  async update(idEjercicio: number, dto: UpdateEjercicioDto) {
    await this.findOne(idEjercicio);

    const { pistas, patronValidacion, outputEsperado, stdin, ...ejercicioData } = dto;

    const ejercicio = await this.prisma.ejercicio.update({
      where: { idEjercicio },
      data: ejercicioData,
    });

    // Actualizar o crear la solución si se enviaron campos de validación
    if (patronValidacion !== undefined || outputEsperado !== undefined || stdin !== undefined) {
      await this.prisma.solucion.upsert({
        where: { idEjercicio },
        create: {
          idEjercicio,
          patronValidacion: patronValidacion ?? '',
          outputEsperado: outputEsperado ?? null,
          stdin: stdin ?? null,
        },
        update: {
          ...(patronValidacion !== undefined && { patronValidacion }),
          ...(outputEsperado !== undefined && { outputEsperado }),
          ...(stdin !== undefined && { stdin }),
        },
      });
    }

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
          select: {
            patronValidacion: true,
            outputEsperado: true,
            stdin: true,
          },
        },
      },
    });

    if (!ejercicio) {
      throw new NotFoundException('Ejercicio no encontrado');
    }

    if (!ejercicio.solucion?.outputEsperado && !ejercicio.solucion?.patronValidacion) {
      throw new BadRequestException('El ejercicio no tiene validación configurada');
    }

    // Determinar si usar validación por output o por regex (fallback)
    const usarOutput = !!ejercicio.solucion?.outputEsperado;

    let esCorrecto: boolean;
    let stdoutUsuario = '';
    let stderrUsuario = '';

    if (usarOutput) {
      // ── Validación por comportamiento (output esperado) ──
      const resultado = await this.compilerService.executePython({
        code: dto.respuesta,
        stdin: ejercicio.solucion.stdin ?? '',
      });

      stdoutUsuario = resultado.stdout ?? '';
      stderrUsuario = resultado.stderr ?? '';

      if (!resultado.passed) {
        // Código no compila o tiene error de ejecución
        esCorrecto = false;
      } else {
        // Comparar output del usuario con el esperado (trim para tolerar espacios)
        const outputLimpio = stdoutUsuario.trim();
        const esperadoLimpio = ejercicio.solucion.outputEsperado!.trim();
        esCorrecto = outputLimpio === esperadoLimpio;
      }
    } else {
      // ── Fallback: validación por regex (legado) ──
      const patron = ejercicio.solucion.patronValidacion;
      esCorrecto = this.evaluarRespuestaRegex(dto.respuesta, patron);
    }

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

    // Verificar si el usuario ya habia completado este ejercicio antes
    const progresoExistente = await this.prisma.progresoUsuario.findUnique({
      where: {
        idUsuario_idEjercicio: {
          idUsuario: dto.idUsuario,
          idEjercicio,
        },
      },
      select: { completado: true },
    });

    const yaCompletado = progresoExistente?.completado ?? false;

    // Otorgar puntos solo si es primera vez que acierta
    let puntosOtorgados = 0;
    if (esCorrecto && !yaCompletado) {
      const resultado = await this.puntosService.otorgarPuntos(
        dto.idUsuario,
        ejercicio.dificultad,
        idEjercicio,
      );
      puntosOtorgados = resultado.puntosOtorgados;
    }

    // Marcar ejercicio como completado (primera vez o re-solucion)
    if (esCorrecto) {
      await this.prisma.progresoUsuario.upsert({
        where: {
          idUsuario_idEjercicio: {
            idUsuario: dto.idUsuario,
            idEjercicio,
          },
        },
        create: {
          idUsuario: dto.idUsuario,
          idEjercicio,
          completado: true,
        },
        update: {
          completado: true,
        },
      });
    }

    // Construir feedback detallado
    let feedback: string;
    let errorCompilacion: string | null = null;
    let outputObtenido: string | null = null;
    let outputEsperado: string | null = null;

    if (esCorrecto) {
      if (yaCompletado) {
        feedback = 'Respuesta correcta. Ya habías completado este ejercicio, no se otorgan puntos adicionales.';
      } else {
        feedback = `Respuesta correcta. +${puntosOtorgados} puntos. Buen trabajo.`;
      }
    } else {
      if (usarOutput && stderrUsuario) {
        feedback = 'Tu código tiene errores. Revisá el mensaje de error.';
        errorCompilacion = stderrUsuario;
      } else if (usarOutput) {
        feedback = 'Tu código ejecuta pero no produce el resultado esperado.';
        outputObtenido = stdoutUsuario;
        outputEsperado = ejercicio.solucion.outputEsperado;
      } else {
        feedback = 'Respuesta incorrecta. Revisá la lógica e intenta de nuevo.';
      }
    }

    return {
      ejercicioId: idEjercicio,
      usuarioId: dto.idUsuario,
      esCorrecto,
      puntosOtorgados,
      feedback,
      errorCompilacion,
      outputObtenido,
      outputEsperado,
      intento,
    };
  }

  /**
   * Fallback legacy: evalúa la respuesta contra un patrón regex.
   * Se mantiene para ejercicios que no tienen outputEsperado definido.
   */
  private evaluarRespuestaRegex(respuesta: string, patronValidacion: string): boolean {
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
