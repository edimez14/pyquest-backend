import { PuntosService } from './puntos.service';
import { Request } from 'express';
export declare class PuntosController {
    private readonly puntosService;
    constructor(puntosService: PuntosService);
    obtenerPuntos(request: Request & {
        user?: {
            sub: number;
        };
    }): Promise<{
        puntos: number;
    }>;
    obtenerHistorial(request: Request & {
        user?: {
            sub: number;
        };
    }): Promise<{
        descripcion: string | null;
        idEjercicio: number | null;
        idUsuario: number;
        idTransaccion: number;
        cantidad: number;
        tipo: string;
        fecha: Date;
    }[]>;
}
