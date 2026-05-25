import { DificultadEjercicio } from '@prisma/client';
export declare class FindEjerciciosQueryDto {
    categoria?: string;
    dificultad?: DificultadEjercicio;
    limit?: number;
}
