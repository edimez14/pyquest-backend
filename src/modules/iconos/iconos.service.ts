import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PuntosService } from '../puntos/puntos.service';
import { CreateIconoDto } from './dto/create-icono.dto';

@Injectable()
export class IconosService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly puntosService: PuntosService,
    ) { }

    // Catalogo completo de iconos disponibles (incluye costo)
    async findAll() {
        return this.prisma.icono.findMany({
            orderBy: { idIcono: 'asc' },
            select: { idIcono: true, nombre: true, ruta: true, descripcion: true, costo: true },
        });
    }

    // Crear un icono en el catalogo (admin/seeding)
    async create(dto: CreateIconoDto) {
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

    // Iconos desbloqueados por un usuario (incluye costo del icono)
    async getIconosUsuario(idUsuario: number) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { idUsuario },
            select: { idUsuario: true },
        });

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
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

    // Desbloquear un icono gratis (solo iconos con costo 0) para un usuario
    async unlockIcono(idUsuario: number, idIcono: number) {
        // Verificar que el icono existe y es gratuito
        const icono = await this.prisma.icono.findUnique({
            where: { idIcono },
            select: { idIcono: true, costo: true },
        });

        if (!icono) {
            throw new NotFoundException('Icono no encontrado');
        }

        if (icono.costo > 0) {
            throw new BadRequestException(
                'Este icono tiene costo. Usa /iconos/comprar/:idIcono para adquirirlo.',
            );
        }

        // Verificar que el usuario existe
        const usuario = await this.prisma.usuario.findUnique({
            where: { idUsuario },
            select: { idUsuario: true },
        });

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        // Upsert: si ya esta desbloqueado no hace nada, si no lo crea
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

    // Comprar un icono con puntos (solo iconos con costo > 0)
    async comprarIcono(idUsuario: number, idIcono: number) {
        // Verificar que el icono existe y tiene costo
        const icono = await this.prisma.icono.findUnique({
            where: { idIcono },
            select: { idIcono: true, nombre: true, costo: true },
        });

        if (!icono) {
            throw new NotFoundException('Icono no encontrado');
        }

        if (icono.costo <= 0) {
            throw new BadRequestException(
                'Este icono es gratuito. Usa /iconos/usuario/:idIcono para desbloquearlo.',
            );
        }

        // Verificar que el usuario existe
        const usuario = await this.prisma.usuario.findUnique({
            where: { idUsuario },
            select: { idUsuario: true },
        });

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        // Verificar si ya lo posee
        const yaDesbloqueado = await this.prisma.usuarioIcono.findUnique({
            where: { idUsuario_idIcono: { idUsuario, idIcono } },
        });

        if (yaDesbloqueado) {
            throw new BadRequestException('Ya tienes este icono desbloqueado.');
        }

        // Deducir puntos (lanza BadRequestException si no tiene suficientes)
        await this.puntosService.gastarPuntos(
            idUsuario,
            icono.costo,
            `Compra icono: ${icono.nombre}`,
        );

        // Crear relacion usuario-icono
        return this.prisma.usuarioIcono.create({
            data: { idUsuario, idIcono },
            include: {
                icono: {
                    select: { idIcono: true, nombre: true, ruta: true, descripcion: true, costo: true },
                },
            },
        });
    }

    // Obtener el icono activo del perfil del usuario (incluye costo)
    async getIconoActivo(idUsuario: number) {
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
            throw new NotFoundException('Perfil no encontrado');
        }

        return perfil.iconoActivo ?? null;
    }

    // Establecer el icono activo del perfil (solo si el usuario lo posee)
    async setIconoActivo(idUsuario: number, idIcono: number) {
        // Verificar que el icono existe
        const icono = await this.prisma.icono.findUnique({
            where: { idIcono },
            select: { idIcono: true },
        });

        if (!icono) {
            throw new NotFoundException('Icono no encontrado');
        }

        // Verificar que el usuario posee el icono
        const poseeIcono = await this.prisma.usuarioIcono.findUnique({
            where: { idUsuario_idIcono: { idUsuario, idIcono } },
            select: { idIcono: true },
        });

        if (!poseeIcono) {
            throw new BadRequestException(
                'No puedes usar un icono que no has desbloqueado. Desbloquealo o compralo primero.',
            );
        }

        const perfil = await this.prisma.perfil.findUnique({
            where: { idUsuario },
            select: { idPerfil: true },
        });

        if (!perfil) {
            throw new NotFoundException('Perfil no encontrado');
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
}
