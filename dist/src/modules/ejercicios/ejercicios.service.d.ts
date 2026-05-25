import { PrismaService } from '../../database/prisma.service';
import { CreateEjercicioDto } from './dto/create-ejercicio.dto';
import { UpdateEjercicioDto } from './dto/update-ejercicio.dto';
import { FindEjerciciosQueryDto } from './dto/find-ejercicios-query.dto';
import { ValidarEjercicioDto } from './dto/validar-ejercicio.dto';
import { RachasService } from '../rachas/rachas.service';
import { PuntosService } from '../puntos/puntos.service';
import { PistasService } from './pistas.service';
export declare class EjerciciosService {
    private readonly prisma;
    private readonly rachasService;
    private readonly puntosService;
    private readonly pistasService;
    constructor(prisma: PrismaService, rachasService: RachasService, puntosService: PuntosService, pistasService: PistasService);
    findAll(query: FindEjerciciosQueryDto): Promise<{
        titulo: string;
        descripcion: string;
        dificultad: import("@prisma/client").$Enums.DificultadEjercicio;
        categoria: string;
        idEjercicio: number;
    }[]>;
    findOne(idEjercicio: number): Promise<{
        titulo: string;
        descripcion: string;
        dificultad: import("@prisma/client").$Enums.DificultadEjercicio;
        categoria: string;
        idEjercicio: number;
    }>;
    create(dto: CreateEjercicioDto): Promise<{
        pistas: import("./dto/pista.dto").PistaItemDto[];
        titulo: string;
        descripcion: string;
        dificultad: import("@prisma/client").$Enums.DificultadEjercicio;
        categoria: string;
        idEjercicio: number;
    }>;
    update(idEjercicio: number, dto: UpdateEjercicioDto): Promise<{
        pistas?: import("./dto/pista.dto").PistaItemDto[] | undefined;
        titulo: string;
        descripcion: string;
        dificultad: import("@prisma/client").$Enums.DificultadEjercicio;
        categoria: string;
        idEjercicio: number;
    }>;
    remove(idEjercicio: number): Promise<{
        message: string;
    }>;
    validarRespuesta(idEjercicio: number, dto: ValidarEjercicioDto): Promise<{
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
    private evaluarRespuesta;
    private normalizarTexto;
}
