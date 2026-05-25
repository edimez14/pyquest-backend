import { PrismaService } from '../../database/prisma.service';
import { FindProgresoQueryDto } from './dto/find-progreso-query.dto';
import { UpsertProgresoDto } from './dto/upsert-progreso.dto';
export declare class ProgresoService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: FindProgresoQueryDto): import("@prisma/client").Prisma.PrismaPromise<({
        ejercicio: {
            titulo: string;
            dificultad: import("@prisma/client").$Enums.DificultadEjercicio;
            categoria: string;
            idEjercicio: number;
        };
    } & {
        idEjercicio: number;
        idUsuario: number;
        idProgreso: number;
        completado: boolean;
    })[]>;
    findOne(idProgreso: number): Promise<{
        ejercicio: {
            titulo: string;
            dificultad: import("@prisma/client").$Enums.DificultadEjercicio;
            categoria: string;
            idEjercicio: number;
        };
        usuario: {
            nombre: string;
            email: string;
            idUsuario: number;
        };
    } & {
        idEjercicio: number;
        idUsuario: number;
        idProgreso: number;
        completado: boolean;
    }>;
    upsert(dto: UpsertProgresoDto): Promise<{
        ejercicio: {
            titulo: string;
            idEjercicio: number;
        };
    } & {
        idEjercicio: number;
        idUsuario: number;
        idProgreso: number;
        completado: boolean;
    }>;
    remove(idProgreso: number): Promise<{
        message: string;
    }>;
}
