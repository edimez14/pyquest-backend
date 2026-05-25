import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { IconosService } from './iconos.service';
import { PrismaService } from '../../database/prisma.service';
import { PuntosService } from '../puntos/puntos.service';

describe('IconosService', () => {
    let service: IconosService;
    let prisma: PrismaService;
    let puntosService: PuntosService;

    const mockIcono = { idIcono: 1, nombre: 'Estrella', ruta: '/icons/star.svg', descripcion: 'Icono estrella', costo: 0 };
    const mockIcono2 = { idIcono: 2, nombre: 'Trofeo', ruta: '/icons/trophy.svg', descripcion: 'Icono trofeo', costo: 100 };
    const mockPerfil = { idPerfil: 1, idIconoActivo: null, iconoActivo: null };
    const mockUsuarioIcono = {
        idUsuario: 1,
        idIcono: 1,
        fechaDesbloqueo: new Date(),
        icono: mockIcono,
    };

    const prismaMock = {
        icono: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
        },
        usuario: {
            findUnique: jest.fn(),
        },
        usuarioIcono: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            upsert: jest.fn(),
            create: jest.fn(),
        },
        perfil: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    };

    const puntosServiceMock = {
        gastarPuntos: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                IconosService,
                { provide: PrismaService, useValue: prismaMock },
                { provide: PuntosService, useValue: puntosServiceMock },
            ],
        }).compile();

        service = module.get<IconosService>(IconosService);
        prisma = module.get<PrismaService>(PrismaService);
        puntosService = module.get<PuntosService>(PuntosService);
    });

    describe('findAll', () => {
        it('debe retornar todos los iconos ordenados por idIcono ascendente', async () => {
            prismaMock.icono.findMany.mockResolvedValue([mockIcono, mockIcono2]);

            const result = await service.findAll();

            expect(result).toHaveLength(2);
            expect(result[0].nombre).toBe('Estrella');
            expect(result[1].nombre).toBe('Trofeo');
            expect(prismaMock.icono.findMany).toHaveBeenCalledWith({
                orderBy: { idIcono: 'asc' },
                select: { idIcono: true, nombre: true, ruta: true, descripcion: true, costo: true },
            });
        });

        it('debe retornar array vacio cuando no hay iconos', async () => {
            prismaMock.icono.findMany.mockResolvedValue([]);

            const result = await service.findAll();

            expect(result).toEqual([]);
        });
    });

    describe('create', () => {
        it('debe crear un icono con costo por defecto 0', async () => {
            const dto = { nombre: 'Nuevo', ruta: '/icons/new.svg', descripcion: 'Nuevo icono' };
            prismaMock.icono.create.mockResolvedValue({ idIcono: 3, ...dto, costo: 0 });

            const result = await service.create(dto);

            expect(result.nombre).toBe('Nuevo');
            expect(result.idIcono).toBe(3);
            expect(result.costo).toBe(0);
            expect(prismaMock.icono.create).toHaveBeenCalledWith({
                data: { nombre: 'Nuevo', ruta: '/icons/new.svg', descripcion: 'Nuevo icono', costo: 0 },
                select: { idIcono: true, nombre: true, ruta: true, descripcion: true, costo: true },
            });
        });

        it('debe crear un icono con costo especifico', async () => {
            const dto = { nombre: 'Premium', ruta: '/icons/premium.svg', costo: 50 };
            prismaMock.icono.create.mockResolvedValue({ idIcono: 5, ...dto, descripcion: null });

            const result = await service.create(dto);

            expect(result.costo).toBe(50);
            expect(prismaMock.icono.create).toHaveBeenCalledWith({
                data: { nombre: 'Premium', ruta: '/icons/premium.svg', descripcion: undefined, costo: 50 },
                select: { idIcono: true, nombre: true, ruta: true, descripcion: true, costo: true },
            });
        });
    });

    describe('getIconosUsuario', () => {
        it('debe retornar iconos desbloqueados del usuario (con costo)', async () => {
            prismaMock.usuario.findUnique.mockResolvedValue({ idUsuario: 1 });
            prismaMock.usuarioIcono.findMany.mockResolvedValue([mockUsuarioIcono]);

            const result = await service.getIconosUsuario(1);

            expect(result).toHaveLength(1);
            expect(result[0].icono.nombre).toBe('Estrella');
            expect(result[0].icono.costo).toBe(0);
            expect(prismaMock.usuarioIcono.findMany).toHaveBeenCalledWith({
                where: { idUsuario: 1 },
                orderBy: { fechaDesbloqueo: 'asc' },
                include: {
                    icono: {
                        select: { idIcono: true, nombre: true, ruta: true, descripcion: true, costo: true },
                    },
                },
            });
        });

        it('debe lanzar NotFoundException si el usuario no existe', async () => {
            prismaMock.usuario.findUnique.mockResolvedValue(null);

            await expect(service.getIconosUsuario(999)).rejects.toThrow(NotFoundException);
        });

        it('debe retornar array vacio si usuario no tiene iconos', async () => {
            prismaMock.usuario.findUnique.mockResolvedValue({ idUsuario: 1 });
            prismaMock.usuarioIcono.findMany.mockResolvedValue([]);

            const result = await service.getIconosUsuario(1);

            expect(result).toEqual([]);
        });
    });

    describe('unlockIcono', () => {
        it('debe desbloquear un icono gratuito (costo 0)', async () => {
            prismaMock.icono.findUnique.mockResolvedValue({ idIcono: 1, costo: 0 });
            prismaMock.usuario.findUnique.mockResolvedValue({ idUsuario: 1 });
            prismaMock.usuarioIcono.upsert.mockResolvedValue(mockUsuarioIcono);

            const result = await service.unlockIcono(1, 1);

            expect(result.icono.nombre).toBe('Estrella');
            expect(prismaMock.usuarioIcono.upsert).toHaveBeenCalledWith({
                where: { idUsuario_idIcono: { idUsuario: 1, idIcono: 1 } },
                create: { idUsuario: 1, idIcono: 1 },
                update: {},
                include: {
                    icono: {
                        select: { idIcono: true, nombre: true, ruta: true, descripcion: true, costo: true },
                    },
                },
            });
        });

        it('debe rechazar icono con costo > 0', async () => {
            prismaMock.icono.findUnique.mockResolvedValue({ idIcono: 2, costo: 100 });

            await expect(service.unlockIcono(1, 2)).rejects.toThrow(BadRequestException);
        });

        it('debe lanzar NotFoundException si el icono no existe', async () => {
            prismaMock.icono.findUnique.mockResolvedValue(null);

            await expect(service.unlockIcono(1, 999)).rejects.toThrow('Icono no encontrado');
        });

        it('debe lanzar NotFoundException si el usuario no existe', async () => {
            prismaMock.icono.findUnique.mockResolvedValue({ idIcono: 1, costo: 0 });
            prismaMock.usuario.findUnique.mockResolvedValue(null);

            await expect(service.unlockIcono(999, 1)).rejects.toThrow('Usuario no encontrado');
        });
    });

    describe('comprarIcono', () => {
        it('debe comprar un icono con puntos y retornarlo', async () => {
            prismaMock.icono.findUnique.mockResolvedValue({ idIcono: 2, nombre: 'Trofeo', costo: 100 });
            prismaMock.usuario.findUnique.mockResolvedValue({ idUsuario: 1 });
            prismaMock.usuarioIcono.findUnique.mockResolvedValue(null); // no lo posee
            puntosServiceMock.gastarPuntos.mockResolvedValue({ puntosRestantes: 900 });
            prismaMock.usuarioIcono.create.mockResolvedValue({
                idUsuario: 1,
                idIcono: 2,
                fechaDesbloqueo: new Date(),
                icono: mockIcono2,
            });

            const result = await service.comprarIcono(1, 2);

            expect(result.icono.nombre).toBe('Trofeo');
            expect(result.icono.costo).toBe(100);
            expect(puntosServiceMock.gastarPuntos).toHaveBeenCalledWith(1, 100, 'Compra icono: Trofeo');
        });

        it('debe rechazar icono con costo 0', async () => {
            prismaMock.icono.findUnique.mockResolvedValue({ idIcono: 1, nombre: 'Estrella', costo: 0 });

            await expect(service.comprarIcono(1, 1)).rejects.toThrow(BadRequestException);
        });

        it('debe rechazar si ya posee el icono', async () => {
            prismaMock.icono.findUnique.mockResolvedValue({ idIcono: 2, nombre: 'Trofeo', costo: 100 });
            prismaMock.usuario.findUnique.mockResolvedValue({ idUsuario: 1 });
            prismaMock.usuarioIcono.findUnique.mockResolvedValue({ idUsuario: 1, idIcono: 2 });

            await expect(service.comprarIcono(1, 2)).rejects.toThrow('Ya tienes este icono desbloqueado.');
        });

        it('debe lanzar NotFoundException si el icono no existe', async () => {
            prismaMock.icono.findUnique.mockResolvedValue(null);

            await expect(service.comprarIcono(1, 999)).rejects.toThrow('Icono no encontrado');
        });

        it('debe lanzar NotFoundException si el usuario no existe', async () => {
            prismaMock.icono.findUnique.mockResolvedValue({ idIcono: 2, nombre: 'Trofeo', costo: 100 });
            prismaMock.usuario.findUnique.mockResolvedValue(null);

            await expect(service.comprarIcono(999, 2)).rejects.toThrow('Usuario no encontrado');
        });
    });

    describe('getIconoActivo', () => {
        it('debe retornar el icono activo del perfil (con costo)', async () => {
            prismaMock.perfil.findUnique.mockResolvedValue({
                idIconoActivo: 1,
                iconoActivo: mockIcono,
            });

            const result = await service.getIconoActivo(1);

            expect(result).toEqual(mockIcono);
        });

        it('debe retornar null si no hay icono activo', async () => {
            prismaMock.perfil.findUnique.mockResolvedValue(mockPerfil);

            const result = await service.getIconoActivo(1);

            expect(result).toBeNull();
        });

        it('debe lanzar NotFoundException si el perfil no existe', async () => {
            prismaMock.perfil.findUnique.mockResolvedValue(null);

            await expect(service.getIconoActivo(999)).rejects.toThrow('Perfil no encontrado');
        });
    });

    describe('setIconoActivo', () => {
        it('debe cambiar el icono activo si el usuario lo posee', async () => {
            prismaMock.icono.findUnique.mockResolvedValue({ idIcono: 2 });
            prismaMock.usuarioIcono.findUnique.mockResolvedValue({ idIcono: 2 }); // lo posee
            prismaMock.perfil.findUnique.mockResolvedValue({ idPerfil: 1 });
            prismaMock.perfil.update.mockResolvedValue({
                idIconoActivo: 2,
                iconoActivo: mockIcono2,
            });

            const result = await service.setIconoActivo(1, 2);

            expect(result.iconoActivo.nombre).toBe('Trofeo');
            expect(prismaMock.perfil.update).toHaveBeenCalledWith({
                where: { idUsuario: 1 },
                data: { idIconoActivo: 2 },
                select: {
                    idIconoActivo: true,
                    iconoActivo: {
                        select: { idIcono: true, nombre: true, ruta: true, descripcion: true, costo: true },
                    },
                },
            });
        });

        it('debe rechazar si el usuario no posee el icono', async () => {
            prismaMock.icono.findUnique.mockResolvedValue({ idIcono: 2 });
            prismaMock.usuarioIcono.findUnique.mockResolvedValue(null); // no lo posee

            await expect(service.setIconoActivo(1, 2)).rejects.toThrow(BadRequestException);
        });

        it('debe lanzar NotFoundException si el icono no existe', async () => {
            prismaMock.icono.findUnique.mockResolvedValue(null);

            await expect(service.setIconoActivo(1, 999)).rejects.toThrow('Icono no encontrado');
        });

        it('debe lanzar NotFoundException si el perfil no existe', async () => {
            prismaMock.icono.findUnique.mockResolvedValue({ idIcono: 1 });
            prismaMock.usuarioIcono.findUnique.mockResolvedValue({ idIcono: 1 });
            prismaMock.perfil.findUnique.mockResolvedValue(null);

            await expect(service.setIconoActivo(999, 1)).rejects.toThrow('Perfil no encontrado');
        });
    });
});
