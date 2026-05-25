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
exports.RachasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let RachasService = class RachasService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async obtenerRachas(idUsuario) {
        const perfil = await this.prisma.perfil.findUnique({
            where: { idUsuario },
            select: {
                rachaDiaria: true,
                rachaDiariaMax: true,
                rachaConsecutiva: true,
                rachaConsecutivaMax: true,
                inicioRachaDiaria: true,
                inicioRachaConsecutiva: true,
                fechaUltimoEjercicio: true,
            },
        });
        if (!perfil) {
            throw new common_1.NotFoundException('Perfil no encontrado para el usuario');
        }
        return {
            rachaDiaria: perfil.rachaDiaria,
            rachaDiariaMax: perfil.rachaDiariaMax,
            rachaConsecutiva: perfil.rachaConsecutiva,
            rachaConsecutivaMax: perfil.rachaConsecutivaMax,
            inicioRachaDiaria: perfil.inicioRachaDiaria,
            inicioRachaConsecutiva: perfil.inicioRachaConsecutiva,
            fechaUltimoEjercicio: perfil.fechaUltimoEjercicio,
        };
    }
    async actualizarRachas(idUsuario, esCorrecto) {
        const ahora = new Date();
        if (esCorrecto) {
            await this.incrementarRachaConsecutiva(idUsuario, ahora);
        }
        else {
            await this.reiniciarRachaConsecutiva(idUsuario, ahora);
        }
        if (esCorrecto) {
            await this.actualizarRachaDiaria(idUsuario, ahora);
        }
        await this.prisma.perfil.update({
            where: { idUsuario },
            data: { ultimaActualizacionRachas: ahora },
        });
    }
    async incrementarRachaConsecutiva(idUsuario, ahora) {
        const perfil = await this.prisma.perfil.findUnique({
            where: { idUsuario },
            select: { rachaConsecutiva: true, rachaConsecutivaMax: true },
        });
        if (!perfil)
            return;
        const nuevaRacha = perfil.rachaConsecutiva + 1;
        const nuevoMax = Math.max(nuevaRacha, perfil.rachaConsecutivaMax);
        await this.prisma.perfil.update({
            where: { idUsuario },
            data: {
                rachaConsecutiva: nuevaRacha,
                rachaConsecutivaMax: nuevoMax,
                inicioRachaConsecutiva: perfil.rachaConsecutiva === 0
                    ? ahora
                    : undefined,
            },
        });
    }
    async reiniciarRachaConsecutiva(idUsuario, ahora) {
        await this.prisma.perfil.update({
            where: { idUsuario },
            data: {
                rachaConsecutiva: 0,
                inicioRachaConsecutiva: null,
            },
        });
    }
    async actualizarRachaDiaria(idUsuario, ahora) {
        const perfil = await this.prisma.perfil.findUnique({
            where: { idUsuario },
            select: {
                rachaDiaria: true,
                rachaDiariaMax: true,
                fechaUltimoEjercicio: true,
            },
        });
        if (!perfil)
            return;
        const hoy = this.fechaSinHora(ahora);
        let nuevaRacha;
        let mantenerInicio;
        if (!perfil.fechaUltimoEjercicio) {
            nuevaRacha = 1;
            mantenerInicio = false;
        }
        else {
            const ultimoDia = this.fechaSinHora(perfil.fechaUltimoEjercicio);
            const diffDias = this.diferenciaEnDias(ultimoDia, hoy);
            if (diffDias === 0) {
                nuevaRacha = perfil.rachaDiaria;
                mantenerInicio = true;
            }
            else if (diffDias === 1) {
                nuevaRacha = perfil.rachaDiaria + 1;
                mantenerInicio = true;
            }
            else {
                nuevaRacha = 1;
                mantenerInicio = false;
            }
        }
        const nuevoMax = Math.max(nuevaRacha, perfil.rachaDiariaMax);
        await this.prisma.perfil.update({
            where: { idUsuario },
            data: {
                rachaDiaria: nuevaRacha,
                rachaDiariaMax: nuevoMax,
                fechaUltimoEjercicio: ahora,
                inicioRachaDiaria: mantenerInicio
                    ? undefined
                    : ahora,
            },
        });
    }
    fechaSinHora(fecha) {
        return new Date(Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate()));
    }
    diferenciaEnDias(fecha1, fecha2) {
        const msPorDia = 1000 * 60 * 60 * 24;
        return Math.floor((fecha2.getTime() - fecha1.getTime()) / msPorDia);
    }
};
exports.RachasService = RachasService;
exports.RachasService = RachasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RachasService);
//# sourceMappingURL=rachas.service.js.map