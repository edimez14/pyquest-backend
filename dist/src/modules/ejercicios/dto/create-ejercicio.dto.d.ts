import { DificultadEjercicio } from '@prisma/client';
import { PistaItemDto } from './pista.dto';
export declare class CreateEjercicioDto {
    titulo: string;
    descripcion: string;
    dificultad: DificultadEjercicio;
    categoria: string;
    pistas: PistaItemDto[];
}
