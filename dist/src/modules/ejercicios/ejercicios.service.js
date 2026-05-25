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
exports.EjerciciosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const rachas_service_1 = require("../rachas/rachas.service");
const puntos_service_1 = require("../puntos/puntos.service");
const pistas_service_1 = require("./pistas.service");
let EjerciciosService = class EjerciciosService {
    prisma;
    rachasService;
    puntosService;
    pistasService;
    constructor(prisma, rachasService, puntosService, pistasService) {
        this.prisma = prisma;
        this.rachasService = rachasService;
        this.puntosService = puntosService;
        this.pistasService = pistasService;
    }
    async findAll(query) {
        const where = {
            ...(query.categoria ? { categoria: query.categoria } : {}),
            ...(query.dificultad ? { dificultad: query.dificultad } : {}),
        };
        return this.prisma.ejercicio.findMany({
            where,
            orderBy: { idEjercicio: 'asc' },
            take: query.limit ?? 50,
        });
    }
    async findOne(idEjercicio) {
        const ejercicio = await this.prisma.ejercicio.findUnique({
            where: { idEjercicio },
        });
        if (!ejercicio) {
            throw new common_1.NotFoundException('Ejercicio no encontrado');
        }
        return ejercicio;
    }
    async create(dto) {
        const { pistas, ...ejercicioData } = dto;
        const ejercicio = await this.prisma.ejercicio.create({
            data: ejercicioData,
        });
        await this.pistasService.createPistas(ejercicio.idEjercicio, pistas);
        return { ...ejercicio, pistas };
    }
    async update(idEjercicio, dto) {
        await this.findOne(idEjercicio);
        const { pistas, ...ejercicioData } = dto;
        const ejercicio = await this.prisma.ejercicio.update({
            where: { idEjercicio },
            data: ejercicioData,
        });
        if (pistas) {
            await this.pistasService.replacePistas(idEjercicio, pistas);
        }
        return { ...ejercicio, ...(pistas && { pistas }) };
    }
    async remove(idEjercicio) {
        await this.findOne(idEjercicio);
        await this.prisma.ejercicio.delete({
            where: { idEjercicio },
        });
        return { message: 'Ejercicio eliminado correctamente' };
    }
    async validarRespuesta(idEjercicio, dto) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { idUsuario: dto.idUsuario },
            select: { idUsuario: true },
        });
        if (!usuario) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        const ejercicio = await this.prisma.ejercicio.findUnique({
            where: { idEjercicio },
            include: {
                solucion: {
                    select: { patronValidacion: true },
                },
            },
        });
        if (!ejercicio) {
            throw new common_1.NotFoundException('Ejercicio no encontrado');
        }
        if (!ejercicio.solucion?.patronValidacion) {
            throw new common_1.BadRequestException('El ejercicio no tiene patrón de validación configurado');
        }
        const patron = ejercicio.solucion.patronValidacion;
        const esCorrecto = this.evaluarRespuesta(dto.respuesta, patron);
        const intento = await this.prisma.intento.create({
            data: {
                idUsuario: dto.idUsuario,
                idEjercicio,
                respuesta: dto.respuesta,
                esCorrecto,
            },
            select: {
                idIntento: true,
                fecha: true,
                esCorrecto: true,
            },
        });
        await this.rachasService.actualizarRachas(dto.idUsuario, esCorrecto);
        const progresoExistente = await this.prisma.progresoUsuario.findUnique({
            where: {
                idUsuario_idEjercicio: {
                    idUsuario: dto.idUsuario,
                    idEjercicio,
                },
            },
            select: { completado: true },
        });
        const yaCompletado = progresoExistente?.completado ?? false;
        let puntosOtorgados = 0;
        if (esCorrecto && !yaCompletado) {
            const resultado = await this.puntosService.otorgarPuntos(dto.idUsuario, ejercicio.dificultad, idEjercicio);
            puntosOtorgados = resultado.puntosOtorgados;
        }
        if (esCorrecto) {
            await this.prisma.progresoUsuario.upsert({
                where: {
                    idUsuario_idEjercicio: {
                        idUsuario: dto.idUsuario,
                        idEjercicio,
                    },
                },
                create: {
                    idUsuario: dto.idUsuario,
                    idEjercicio,
                    completado: true,
                },
                update: {
                    completado: true,
                },
            });
        }
        let feedback;
        if (esCorrecto) {
            if (yaCompletado) {
                feedback = 'Respuesta correcta. Ya habías completado este ejercicio, no se otorgan puntos adicionales.';
            }
            else {
                feedback = `Respuesta correcta. +${puntosOtorgados} puntos. Buen trabajo.`;
            }
        }
        else {
            feedback = 'Respuesta incorrecta. Revisa la lógica e intenta de nuevo.';
        }
        return {
            ejercicioId: idEjercicio,
            usuarioId: dto.idUsuario,
            esCorrecto,
            puntosOtorgados,
            feedback,
            intento,
        };
    }
    evaluarRespuesta(respuesta, patronValidacion) {
        const respuestaNormalizada = this.normalizarTexto(respuesta);
        const patronNormalizado = patronValidacion.trim();
        const regexLiteral = patronNormalizado.match(/^\/(.*)\/([gimsuy]*)$/);
        if (regexLiteral) {
            const [, pattern, flags] = regexLiteral;
            try {
                const regex = new RegExp(pattern, flags);
                return regex.test(respuesta);
            }
            catch {
                throw new common_1.BadRequestException('El patrón de validación regex es inválido');
            }
        }
        return respuestaNormalizada === this.normalizarTexto(patronNormalizado);
    }
    normalizarTexto(texto) {
        return texto
            .trim()
            .toLowerCase()
            .replace(/\s+/g, ' ');
    }
};
exports.EjerciciosService = EjerciciosService;
exports.EjerciciosService = EjerciciosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        rachas_service_1.RachasService,
        puntos_service_1.PuntosService,
        pistas_service_1.PistasService])
], EjerciciosService);
//# sourceMappingURL=ejercicios.service.js.map