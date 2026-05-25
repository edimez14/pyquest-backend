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
exports.IconosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const puntos_service_1 = require("../puntos/puntos.service");
let IconosService = class IconosService {
    prisma;
    puntosService;
    constructor(prisma, puntosService) {
        this.prisma = prisma;
        this.puntosService = puntosService;
    }
    async findAll() {
        return this.prisma.icono.findMany({
            orderBy: { idIcono: 'asc' },
            select: { idIcono: true, nombre: true, ruta: true, descripcion: true, costo: true },
        });
    }
    async create(dto) {
        return this.prisma.icono.create({
            data: {
                nombre: dto.nombre,
                ruta: dto.ruta,
                descripcion: dto.descripcion,
                costo: dto.costo ?? 0,
            },
            select: { idIcono: true, nombre: true, ruta: true, descripcion: true, costo: true },
        });
    }
    async getIconosUsuario(idUsuario) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { idUsuario },
            select: { idUsuario: true },
        });
        if (!usuario) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        return this.prisma.usuarioIcono.findMany({
            where: { idUsuario },
            orderBy: { fechaDesbloqueo: 'asc' },
            include: {
                icono: {
                    select: { idIcono: true, nombre: true, ruta: true, descripcion: true, costo: true },
                },
            },
        });
    }
    async unlockIcono(idUsuario, idIcono) {
        const icono = await this.prisma.icono.findUnique({
            where: { idIcono },
            select: { idIcono: true, costo: true },
        });
        if (!icono) {
            throw new common_1.NotFoundException('Icono no encontrado');
        }
        if (icono.costo > 0) {
            throw new common_1.BadRequestException('Este icono tiene costo. Usa /iconos/comprar/:idIcono para adquirirlo.');
        }
        const usuario = await this.prisma.usuario.findUnique({
            where: { idUsuario },
            select: { idUsuario: true },
        });
        if (!usuario) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        return this.prisma.usuarioIcono.upsert({
            where: {
                idUsuario_idIcono: { idUsuario, idIcono },
            },
            create: { idUsuario, idIcono },
            update: {},
            include: {
                icono: {
                    select: { idIcono: true, nombre: true, ruta: true, descripcion: true, costo: true },
                },
            },
        });
    }
    async comprarIcono(idUsuario, idIcono) {
        const icono = await this.prisma.icono.findUnique({
            where: { idIcono },
            select: { idIcono: true, nombre: true, costo: true },
        });
        if (!icono) {
            throw new common_1.NotFoundException('Icono no encontrado');
        }
        if (icono.costo <= 0) {
            throw new common_1.BadRequestException('Este icono es gratuito. Usa /iconos/usuario/:idIcono para desbloquearlo.');
        }
        const usuario = await this.prisma.usuario.findUnique({
            where: { idUsuario },
            select: { idUsuario: true },
        });
        if (!usuario) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        const yaDesbloqueado = await this.prisma.usuarioIcono.findUnique({
            where: { idUsuario_idIcono: { idUsuario, idIcono } },
        });
        if (yaDesbloqueado) {
            throw new common_1.BadRequestException('Ya tienes este icono desbloqueado.');
        }
        await this.puntosService.gastarPuntos(idUsuario, icono.costo, `Compra icono: ${icono.nombre}`);
        return this.prisma.usuarioIcono.create({
            data: { idUsuario, idIcono },
            include: {
                icono: {
                    select: { idIcono: true, nombre: true, ruta: true, descripcion: true, costo: true },
                },
            },
        });
    }
    async getIconoActivo(idUsuario) {
        const perfil = await this.prisma.perfil.findUnique({
            where: { idUsuario },
            select: {
                idIconoActivo: true,
                iconoActivo: {
                    select: { idIcono: true, nombre: true, ruta: true, descripcion: true, costo: true },
                },
            },
        });
        if (!perfil) {
            throw new common_1.NotFoundException('Perfil no encontrado');
        }
        return perfil.iconoActivo ?? null;
    }
    async setIconoActivo(idUsuario, idIcono) {
        const icono = await this.prisma.icono.findUnique({
            where: { idIcono },
            select: { idIcono: true },
        });
        if (!icono) {
            throw new common_1.NotFoundException('Icono no encontrado');
        }
        const poseeIcono = await this.prisma.usuarioIcono.findUnique({
            where: { idUsuario_idIcono: { idUsuario, idIcono } },
            select: { idIcono: true },
        });
        if (!poseeIcono) {
            throw new common_1.BadRequestException('No puedes usar un icono que no has desbloqueado. Desbloquealo o compralo primero.');
        }
        const perfil = await this.prisma.perfil.findUnique({
            where: { idUsuario },
            select: { idPerfil: true },
        });
        if (!perfil) {
            throw new common_1.NotFoundException('Perfil no encontrado');
        }
        return this.prisma.perfil.update({
            where: { idUsuario },
            data: { idIconoActivo: idIcono },
            select: {
                idIconoActivo: true,
                iconoActivo: {
                    select: { idIcono: true, nombre: true, ruta: true, descripcion: true, costo: true },
                },
            },
        });
    }
};
exports.IconosService = IconosService;
exports.IconosService = IconosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        puntos_service_1.PuntosService])
], IconosService);
//# sourceMappingURL=iconos.service.js.map