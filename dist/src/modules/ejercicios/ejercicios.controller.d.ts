import { EjerciciosService } from './ejercicios.service';
import { PistasService } from './pistas.service';
import { CreateEjercicioDto } from './dto/create-ejercicio.dto';
import { UpdateEjercicioDto } from './dto/update-ejercicio.dto';
import { FindEjercicioParamsDto } from './dto/find-ejercicio-params.dto';
import { FindEjerciciosQueryDto } from './dto/find-ejercicios-query.dto';
import { ValidarEjercicioDto } from './dto/validar-ejercicio.dto';
export declare class EjerciciosController {
    private readonly ejerciciosService;
    private readonly pistasService;
    constructor(ejerciciosService: EjerciciosService, pistasService: PistasService);
    findAll(query: FindEjerciciosQueryDto): Promise<{
        titulo: string;
        descripcion: string;
        dificultad: import("@prisma/client").$Enums.DificultadEjercicio;
        categoria: string;
        idEjercicio: number;
    }[]>;
    findOne(params: FindEjercicioParamsDto): Promise<{
        titulo: string;
        descripcion: string;
        dificultad: import("@prisma/client").$Enums.DificultadEjercicio;
        categoria: string;
        idEjercicio: number;
    }>;
    getPistas(params: FindEjercicioParamsDto): Promise<{
        orden: number;
        texto: string;
        idPista: number;
    }[]>;
    create(dto: CreateEjercicioDto): Promise<{
        pistas: import("./dto/pista.dto").PistaItemDto[];
        titulo: string;
        descripcion: string;
        dificultad: import("@prisma/client").$Enums.DificultadEjercicio;
        categoria: string;
        idEjercicio: number;
    }>;
    validar(params: FindEjercicioParamsDto, dto: ValidarEjercicioDto): Promise<{
        ejercicioId: number;
        usuarioId: number;
        esCorrecto: boolean;
        puntosOtorgados: number;
        feedback: string;
        intento: {
            fecha: Date;
            esCorrecto: boolean;
            idIntento: number;
        };
    }>;
    update(params: FindEjercicioParamsDto, dto: UpdateEjercicioDto): Promise<{
        pistas?: import("./dto/pista.dto").PistaItemDto[] | undefined;
        titulo: string;
        descripcion: string;
        dificultad: import("@prisma/client").$Enums.DificultadEjercicio;
        categoria: string;
        idEjercicio: number;
    }>;
    remove(params: FindEjercicioParamsDto): Promise<{
        message: string;
    }>;
}
