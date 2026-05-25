"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let QuizService = class QuizService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(query) {
        return this.prisma.quiz.findMany({
            where: query.search
                ? {
                    OR: [
                        { titulo: { contains: query.search, mode: 'insensitive' } },
                        { descripcion: { contains: query.search, mode: 'insensitive' } },
                    ],
                }
                : undefined,
            include: {
                _count: {
                    select: { preguntas: true },
                },
            },
            orderBy: { idQuiz: 'asc' },
            take: query.limit ?? 50,
        });
    }
    async findOne(idQuiz) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { idQuiz },
            include: {
                preguntas: {
                    include: {
                        respuestas: true,
                    },
                    orderBy: { idPregunta: 'asc' },
                },
            },
        });
        if (!quiz) {
            throw new common_1.NotFoundException('Quiz no encontrado');
        }
        return quiz;
    }
    async create(dto) {
        this.validarPreguntas(dto.preguntas);
        return this.prisma.quiz.create({
            data: {
                titulo: dto.titulo,
                descripcion: dto.descripcion ?? '',
                preguntas: {
                    create: dto.preguntas.map((pregunta) => ({
                        enunciado: pregunta.enunciado,
                        respuestas: {
                            create: pregunta.respuestas,
                        },
                    })),
                },
            },
            include: {
                preguntas: {
                    include: {
                        respuestas: true,
                    },
                },
            },
        });
    }
    async update(idQuiz, dto) {
        await this.findOne(idQuiz);
        if (dto.preguntas) {
            this.validarPreguntas(dto.preguntas);
        }
        return this.prisma.$transaction(async (trx) => {
            await trx.quiz.update({
                where: { idQuiz },
                data: {
                    ...(dto.titulo ? { titulo: dto.titulo } : {}),
                    ...(dto.descripcion !== undefined ? { descripcion: dto.descripcion } : {}),
                },
            });
            if (dto.preguntas) {
                await trx.respuesta.deleteMany({
                    where: {
                        pregunta: {
                            idQuiz,
                        },
                    },
                });
                await trx.pregunta.deleteMany({
                    where: { idQuiz },
                });
                await trx.pregunta.createMany({
                    data: dto.preguntas.map((pregunta) => ({
                        idQuiz,
                        enunciado: pregunta.enunciado,
                    })),
                });
                const preguntasCreadas = await trx.pregunta.findMany({
                    where: { idQuiz },
                    orderBy: { idPregunta: 'asc' },
                });
                const respuestasData = dto.preguntas.flatMap((pregunta, index) => pregunta.respuestas.map((respuesta) => ({
                    idPregunta: preguntasCreadas[index].idPregunta,
                    texto: respuesta.texto,
                    esCorrecta: respuesta.esCorrecta,
                })));
                await trx.respuesta.createMany({
                    data: respuestasData,
                });
            }
            return trx.quiz.findUnique({
                where: { idQuiz },
                include: {
                    preguntas: {
                        include: {
                            respuestas: true,
                        },
                        orderBy: { idPregunta: 'asc' },
                    },
                },
            });
        });
    }
    async remove(idQuiz) {
        await this.findOne(idQuiz);
        await this.prisma.quiz.delete({
            where: { idQuiz },
        });
        return { message: 'Quiz eliminado correctamente' };
    }
    async responder(idQuiz, dto) {
        const quiz = await this.findOne(idQuiz);
        const preguntasMap = new Map(quiz.preguntas.map((pregunta) => [pregunta.idPregunta, pregunta]));
        let correctas = 0;
        const detalle = dto.respuestas.map((item) => {
            const pregunta = preguntasMap.get(item.idPregunta);
            if (!pregunta) {
                throw new common_1.BadRequestException(`La pregunta ${item.idPregunta} no pertenece al quiz`);
            }
            const respuestaSeleccionada = pregunta.respuestas.find((respuesta) => respuesta.idRespuesta === item.idRespuesta);
            if (!respuestaSeleccionada) {
                throw new common_1.BadRequestException(`La respuesta ${item.idRespuesta} no pertenece a la pregunta ${item.idPregunta}`);
            }
            if (respuestaSeleccionada.esCorrecta) {
                correctas += 1;
            }
            return {
                idPregunta: item.idPregunta,
                idRespuesta: item.idRespuesta,
                esCorrecta: respuestaSeleccionada.esCorrecta,
            };
        });
        const totalRespondidas = dto.respuestas.length;
        const porcentaje = totalRespondidas > 0 ? Math.round((correctas / totalRespondidas) * 100) : 0;
        return {
            idQuiz,
            totalRespondidas,
            correctas,
            incorrectas: totalRespondidas - correctas,
            porcentaje,
            detalle,
        };
    }
    validarPreguntas(preguntas) {
        preguntas.forEach((pregunta, index) => {
            const respuestasCorrectas = pregunta.respuestas.filter((respuesta) => respuesta.esCorrecta);
            if (respuestasCorrectas.length !== 1) {
                throw new common_1.BadRequestException(`La pregunta ${index + 1} debe tener exactamente una respuesta correcta`);
            }
        });
    }
};
exports.QuizService = QuizService;
exports.QuizService = QuizService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuizService);
//# sourceMappingURL=quiz.service.js.map