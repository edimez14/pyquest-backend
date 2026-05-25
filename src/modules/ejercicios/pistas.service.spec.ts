import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PistasService } from './pistas.service';
import { PrismaService } from '../../database/prisma.service';

describe('PistasService', () => {
    let service: PistasService;
    let prisma: PrismaService;

    const mockEjercicio = { idEjercicio: 1, titulo: 'Test' };

    // Prisma mock con métodos spy
    const prismaMock = {
        ejercicio: {
            findUnique: jest.fn(),
        },
        pista: {
            findMany: jest.fn(),
            createMany: jest.fn(),
            deleteMany: jest.fn(),
        },
        $transaction: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PistasService,
                { provide: PrismaService, useValue: prismaMock },
            ],
        }).compile();

        service = module.get<PistasService>(PistasService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    describe('getPistas', () => {
        it('debe retornar pistas ordenadas por orden ascendente', async () => {
            prismaMock.ejercicio.findUnique.mockResolvedValue(mockEjercicio);
            prismaMock.pista.findMany.mockResolvedValue([
                { idPista: 1, orden: 1, texto: 'Pista 1' },
                { idPista: 2, orden: 2, texto: 'Pista 2' },
                { idPista: 3, orden: 3, texto: 'Pista 3' },
            ]);

            const result = await service.getPistas(1);

            expect(result).toHaveLength(3);
            expect(result[0].orden).toBe(1);
            expect(result[2].orden).toBe(3);
            expect(prismaMock.pista.findMany).toHaveBeenCalledWith({
                where: { idEjercicio: 1 },
                orderBy: { orden: 'asc' },
                select: { idPista: true, orden: true, texto: true },
            });
        });

        it('debe lanzar NotFoundException si el ejercicio no existe', async () => {
            prismaMock.ejercicio.findUnique.mockResolvedValue(null);

            await expect(service.getPistas(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('createPistas', () => {
        it('debe crear 3 pistas para un ejercicio', async () => {
            prismaMock.pista.createMany.mockResolvedValue({ count: 3 });

            const pistas = [
                { orden: 1, texto: 'Primera pista' },
                { orden: 2, texto: 'Segunda pista' },
                { orden: 3, texto: 'Tercera pista' },
            ];

            await service.createPistas(1, pistas);

            expect(prismaMock.pista.createMany).toHaveBeenCalledWith({
                data: [
                    { idEjercicio: 1, orden: 1, texto: 'Primera pista' },
                    { idEjercicio: 1, orden: 2, texto: 'Segunda pista' },
                    { idEjercicio: 1, orden: 3, texto: 'Tercera pista' },
                ],
            });
        });
    });

    describe('replacePistas', () => {
        it('debe reemplazar pistas existentes con nuevas', async () => {
            prismaMock.ejercicio.findUnique.mockResolvedValue(mockEjercicio);
            prismaMock.$transaction.mockImplementation(
                async (fn: Function) =>
                    fn({
                        pista: {
                            deleteMany: prismaMock.pista.deleteMany,
                            createMany: prismaMock.pista.createMany,
                        },
                    }),
            );
            prismaMock.pista.deleteMany.mockResolvedValue({ count: 3 });
            prismaMock.pista.createMany.mockResolvedValue({ count: 3 });

            const nuevasPistas = [
                { orden: 1, texto: 'Nueva 1' },
                { orden: 2, texto: 'Nueva 2' },
                { orden: 3, texto: 'Nueva 3' },
            ];

            await service.replacePistas(1, nuevasPistas);

            expect(prismaMock.pista.deleteMany).toHaveBeenCalledWith({
                where: { idEjercicio: 1 },
            });
            expect(prismaMock.pista.createMany).toHaveBeenCalledWith({
                data: [
                    { idEjercicio: 1, orden: 1, texto: 'Nueva 1' },
                    { idEjercicio: 1, orden: 2, texto: 'Nueva 2' },
                    { idEjercicio: 1, orden: 3, texto: 'Nueva 3' },
                ],
            });
        });

        it('debe lanzar NotFoundException si el ejercicio no existe', async () => {
            prismaMock.ejercicio.findUnique.mockResolvedValue(null);

            await expect(
                service.replacePistas(999, [
                    { orden: 1, texto: 'X' },
                    { orden: 2, texto: 'Y' },
                    { orden: 3, texto: 'Z' },
                ]),
            ).rejects.toThrow(NotFoundException);
        });
    });
});
