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
exports.ProgresoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let ProgresoService = class ProgresoService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(query) {
        return this.prisma.progresoUsuario.findMany({
            where: {
                idUsuario: query.idUsuario,
                ...(query.completado !== undefined ? { completado: query.completado } : {}),
            },
            include: {
                ejercicio: {
                    select: {
                        idEjercicio: true,
                        titulo: true,
                        categoria: true,
                        dificultad: true,
                    },
                },
            },
            orderBy: { idProgreso: 'asc' },
        });
    }
    async findOne(idProgreso) {
        const progreso = await this.prisma.progresoUsuario.findUnique({
            where: { idProgreso },
            include: {
                usuario: {
                    select: {
                        idUsuario: true,
                        nombre: true,
                        email: true,
                    },
                },
                ejercicio: {
                    select: {
                        idEjercicio: true,
                        titulo: true,
                        categoria: true,
                        dificultad: true,
                    },
                },
            },
        });
        if (!progreso) {
            throw new common_1.NotFoundException('Progreso no encontrado');
        }
        return progreso;
    }
    async upsert(dto) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { idUsuario: dto.idUsuario },
            select: { idUsuario: true },
        });
        if (!usuario) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        const ejercicio = await this.prisma.ejercicio.findUnique({
            where: { idEjercicio: dto.idEjercicio },
            select: { idEjercicio: true },
        });
        if (!ejercicio) {
            throw new common_1.NotFoundException('Ejercicio no encontrado');
        }
        return this.prisma.progresoUsuario.upsert({
            where: {
                idUsuario_idEjercicio: {
                    idUsuario: dto.idUsuario,
                    idEjercicio: dto.idEjercicio,
                },
            },
            create: {
                idUsuario: dto.idUsuario,
                idEjercicio: dto.idEjercicio,
                completado: dto.completado,
            },
            update: {
                completado: dto.completado,
            },
            include: {
                ejercicio: {
                    select: {
                        idEjercicio: true,
                        titulo: true,
                    },
                },
            },
        });
    }
    async remove(idProgreso) {
        await this.findOne(idProgreso);
        await this.prisma.progresoUsuario.delete({
            where: { idProgreso },
        });
        return { message: 'Progreso eliminado correctamente' };
    }
};
exports.ProgresoService = ProgresoService;
exports.ProgresoService = ProgresoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProgresoService);
//# sourceMappingURL=progreso.service.js.map