import { ProgresoService } from './progreso.service';
import { FindProgresoQueryDto } from './dto/find-progreso-query.dto';
import { FindProgresoParamsDto } from './dto/find-progreso-params.dto';
import { UpsertProgresoDto } from './dto/upsert-progreso.dto';
export declare class ProgresoController {
    private readonly progresoService;
    constructor(progresoService: ProgresoService);
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
    findOne(params: FindProgresoParamsDto): Promise<{
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
    remove(params: FindProgresoParamsDto): Promise<{
        message: string;
    }>;
}
