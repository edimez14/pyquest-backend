import { PrismaService } from '../../database/prisma.service';
import { FindQuizQueryDto } from './dto/find-quiz-query.dto';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { ResponderQuizDto } from './dto/responder-quiz.dto';
export declare class QuizService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: FindQuizQueryDto): import("@prisma/client").Prisma.PrismaPromise<({
        _count: {
            preguntas: number;
        };
    } & {
        titulo: string;
        descripcion: string;
        idQuiz: number;
    })[]>;
    findOne(idQuiz: number): Promise<{
        preguntas: ({
            respuestas: {
                texto: string;
                esCorrecta: boolean;
                idPregunta: number;
                idRespuesta: number;
            }[];
        } & {
            enunciado: string;
            idPregunta: number;
            idQuiz: number;
        })[];
    } & {
        titulo: string;
        descripcion: string;
        idQuiz: number;
    }>;
    create(dto: CreateQuizDto): Promise<{
        preguntas: ({
            respuestas: {
                texto: string;
                esCorrecta: boolean;
                idPregunta: number;
                idRespuesta: number;
            }[];
        } & {
            enunciado: string;
            idPregunta: number;
            idQuiz: number;
        })[];
    } & {
        titulo: string;
        descripcion: string;
        idQuiz: number;
    }>;
    update(idQuiz: number, dto: UpdateQuizDto): Promise<({
        preguntas: ({
            respuestas: {
                texto: string;
                esCorrecta: boolean;
                idPregunta: number;
                idRespuesta: number;
            }[];
        } & {
            enunciado: string;
            idPregunta: number;
            idQuiz: number;
        })[];
    } & {
        titulo: string;
        descripcion: string;
        idQuiz: number;
    }) | null>;
    remove(idQuiz: number): Promise<{
        message: string;
    }>;
    responder(idQuiz: number, dto: ResponderQuizDto): Promise<{
        idQuiz: number;
        totalRespondidas: number;
        correctas: number;
        incorrectas: number;
        porcentaje: number;
        detalle: {
            idPregunta: number;
            idRespuesta: number;
            esCorrecta: boolean;
        }[];
    }>;
    private validarPreguntas;
}
