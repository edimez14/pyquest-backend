import { PrismaService } from '../../database/prisma.service';
import { DificultadEjercicio } from '@prisma/client';
export declare class PuntosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    obtenerPuntos(idUsuario: number): Promise<{
        puntos: number;
    }>;
    obtenerHistorial(idUsuario: number): Promise<{
        descripcion: string | null;
        idEjercicio: number | null;
        idUsuario: number;
        idTransaccion: number;
        cantidad: number;
        tipo: string;
        fecha: Date;
    }[]>;
    otorgarPuntos(idUsuario: number, dificultad: DificultadEjercicio, idEjercicio: number): Promise<{
        puntosOtorgados: number;
    }>;
    gastarPuntos(idUsuario: number, cantidad: number, descripcion: string): Promise<{
        puntosRestantes: number;
    }>;
}
