import { QuizService } from './quiz.service';
import { FindQuizQueryDto } from './dto/find-quiz-query.dto';
import { FindQuizParamsDto } from './dto/find-quiz-params.dto';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { ResponderQuizDto } from './dto/responder-quiz.dto';
export declare class QuizController {
    private readonly quizService;
    constructor(quizService: QuizService);
    findAll(query: FindQuizQueryDto): import("@prisma/client").Prisma.PrismaPromise<({
        _count: {
            preguntas: number;
        };
    } & {
        titulo: string;
        descripcion: string;
        idQuiz: number;
    })[]>;
    findOne(params: FindQuizParamsDto): Promise<{
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
    responder(params: FindQuizParamsDto, dto: ResponderQuizDto): Promise<{
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
    update(params: FindQuizParamsDto, dto: UpdateQuizDto): Promise<({
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
    remove(params: FindQuizParamsDto): Promise<{
        message: string;
    }>;
}
