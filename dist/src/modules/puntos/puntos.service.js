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
exports.PuntosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const PUNTOS_POR_DIFICULTAD = {
    BAJO: 10,
    MEDIO: 25,
    ALTO: 50,
};
let PuntosService = class PuntosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async obtenerPuntos(idUsuario) {
        const perfil = await this.prisma.perfil.findUnique({
            where: { idUsuario },
            select: { puntos: true },
        });
        if (!perfil) {
            throw new common_1.NotFoundException('Perfil no encontrado para el usuario');
        }
        return { puntos: perfil.puntos };
    }
    async obtenerHistorial(idUsuario) {
        return this.prisma.transaccionPuntos.findMany({
            where: { idUsuario },
            orderBy: { fecha: 'desc' },
            take: 100,
        });
    }
    async otorgarPuntos(idUsuario, dificultad, idEjercicio) {
        const puntosOtorgados = PUNTOS_POR_DIFICULTAD[dificultad];
        await this.prisma.$transaction([
            this.prisma.perfil.update({
                where: { idUsuario },
                data: { puntos: { increment: puntosOtorgados } },
            }),
            this.prisma.transaccionPuntos.create({
                data: {
                    idUsuario,
                    cantidad: puntosOtorgados,
                    tipo: 'ejercicio_completado',
                    descripcion: `Ejercicio ${idEjercicio} (${dificultad})`,
                    idEjercicio,
                },
            }),
        ]);
        return { puntosOtorgados };
    }
    async gastarPuntos(idUsuario, cantidad, descripcion) {
        const resultado = await this.prisma.$transaction(async (trx) => {
            const perfil = await trx.perfil.findUnique({
                where: { idUsuario },
                select: { puntos: true, idPerfil: true },
            });
            if (!perfil) {
                throw new common_1.NotFoundException('Perfil no encontrado para el usuario');
            }
            if (perfil.puntos < cantidad) {
                throw new common_1.BadRequestException(`Puntos insuficientes. Tienes ${perfil.puntos}, necesitas ${cantidad}.`);
            }
            await trx.perfil.update({
                where: { idUsuario },
                data: { puntos: { decrement: cantidad } },
            });
            await trx.transaccionPuntos.create({
                data: {
                    idUsuario,
                    cantidad: -cantidad,
                    tipo: 'tienda_canje',
                    descripcion,
                },
            });
            return { puntosRestantes: perfil.puntos - cantidad };
        });
        return resultado;
    }
};
exports.PuntosService = PuntosService;
exports.PuntosService = PuntosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PuntosService);
//# sourceMappingURL=puntos.service.js.map