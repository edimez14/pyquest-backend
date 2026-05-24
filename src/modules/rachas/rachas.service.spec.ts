import { Test, TestingModule } from '@nestjs/testing';
import { RachasService } from './rachas.service';
import { PrismaService } from '../../database/prisma.service';

describe('RachasService', () => {
  let service: RachasService;
  let prisma: PrismaService;

  const mockPerfil = {
    idPerfil: 1,
    idUsuario: 1,
    nivel: 1,
    experiencia: 0,
    racha: 0,
    rachaDiaria: 0,
    rachaDiariaMax: 0,
    rachaConsecutiva: 0,
    rachaConsecutivaMax: 0,
    fechaUltimoEjercicio: null as Date | null,
    inicioRachaDiaria: null as Date | null,
    inicioRachaConsecutiva: null as Date | null,
    ultimaActualizacionRachas: null as Date | null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RachasService,
        {
          provide: PrismaService,
          useValue: {
            perfil: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<RachasService>(RachasService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('fechaSinHora', () => {
    it('debe retornar una fecha con hora 00:00:00 en UTC', () => {
      const fecha = new Date('2025-06-15T14:30:45Z');
      const resultado = service.fechaSinHora(fecha);
      expect(resultado.getUTCHours()).toBe(0);
      expect(resultado.getUTCMinutes()).toBe(0);
      expect(resultado.getUTCSeconds()).toBe(0);
      expect(resultado.getUTCFullYear()).toBe(2025);
      expect(resultado.getUTCMonth()).toBe(5); // junio = 5
      expect(resultado.getUTCDate()).toBe(15);
    });
  });

  describe('diferenciaEnDias', () => {
    it('debe retornar 0 para la misma fecha', () => {
      const a = new Date('2025-06-15T00:00:00Z');
      const b = new Date('2025-06-15T23:59:59Z');
      expect(service.diferenciaEnDias(a, b)).toBe(0);
    });

    it('debe retornar 1 para fechas consecutivas', () => {
      const ayer = new Date('2025-06-15T00:00:00Z');
      const hoy = new Date('2025-06-16T00:00:00Z');
      expect(service.diferenciaEnDias(ayer, hoy)).toBe(1);
    });

    it('debe retornar 7 para una semana de diferencia', () => {
      const antes = new Date('2025-06-15T00:00:00Z');
      const despues = new Date('2025-06-22T00:00:00Z');
      expect(service.diferenciaEnDias(antes, despues)).toBe(7);
    });
  });

  describe('obtenerRachas', () => {
    it('debe retornar las rachas del usuario', async () => {
      const perfil = {
        ...mockPerfil,
        rachaDiaria: 5,
        rachaDiariaMax: 10,
        rachaConsecutiva: 3,
        rachaConsecutivaMax: 8,
        inicioRachaDiaria: new Date('2025-06-10T00:00:00Z'),
        inicioRachaConsecutiva: new Date('2025-06-14T00:00:00Z'),
        fechaUltimoEjercicio: new Date('2025-06-15T12:00:00Z'),
      };

      jest.spyOn(prisma.perfil, 'findUnique').mockResolvedValue(perfil);

      const resultado = await service.obtenerRachas(1);

      expect(resultado.rachaDiaria).toBe(5);
      expect(resultado.rachaDiariaMax).toBe(10);
      expect(resultado.rachaConsecutiva).toBe(3);
      expect(resultado.rachaConsecutivaMax).toBe(8);
      expect(resultado.inicioRachaDiaria).toEqual(new Date('2025-06-10T00:00:00Z'));
      expect(resultado.fechaUltimoEjercicio).toEqual(new Date('2025-06-15T12:00:00Z'));
    });

    it('debe lanzar NotFoundException si no existe perfil', async () => {
      jest.spyOn(prisma.perfil, 'findUnique').mockResolvedValue(null);

      await expect(service.obtenerRachas(999)).rejects.toThrow('Perfil no encontrado');
    });
  });

  describe('actualizarRachas', () => {
    it('debe incrementar racha consecutiva cuando esCorrecto=true', async () => {
      const perfil = {
        ...mockPerfil,
        rachaConsecutiva: 2,
        rachaConsecutivaMax: 5,
        fechaUltimoEjercicio: new Date('2025-06-14T12:00:00Z'),
      };

      jest.spyOn(prisma.perfil, 'findUnique')
        .mockResolvedValueOnce(perfil) // incrementarRachaConsecutiva
        .mockResolvedValueOnce(perfil); // actualizarRachaDiaria

      await service.actualizarRachas(1, true);

      // Debe actualizar racha consecutiva a 3
      expect(prisma.perfil.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { idUsuario: 1 },
          data: expect.objectContaining({
            rachaConsecutiva: 3,
            rachaConsecutivaMax: 5, // max se mantiene porque 3 < 5
          }),
        }),
      );
    });

    it('debe actualizar max consecutivo cuando se supera', async () => {
      const perfil = {
        ...mockPerfil,
        rachaConsecutiva: 5,
        rachaConsecutivaMax: 5,
        fechaUltimoEjercicio: new Date('2025-06-14T12:00:00Z'),
      };

      jest.spyOn(prisma.perfil, 'findUnique')
        .mockResolvedValueOnce(perfil)
        .mockResolvedValueOnce(perfil);

      await service.actualizarRachas(1, true);

      expect(prisma.perfil.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { idUsuario: 1 },
          data: expect.objectContaining({
            rachaConsecutiva: 6,
            rachaConsecutivaMax: 6,
          }),
        }),
      );
    });

    it('debe reiniciar racha consecutiva a 0 cuando esCorrecto=false', async () => {
      jest.spyOn(prisma.perfil, 'findUnique')
        .mockResolvedValue(mockPerfil);

      await service.actualizarRachas(1, false);

      expect(prisma.perfil.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { idUsuario: 1 },
          data: expect.objectContaining({
            rachaConsecutiva: 0,
            inicioRachaConsecutiva: null,
          }),
        }),
      );
    });

    it('no debe actualizar racha diaria cuando esCorrecto=false', async () => {
      jest.spyOn(prisma.perfil, 'findUnique')
        .mockResolvedValue(mockPerfil);

      await service.actualizarRachas(1, false);

      // Solo dos llamados: reiniciarRachaConsecutiva + ultimaActualizacionRachas
      // No debe llamar a la logica de racha diaria
      const updateCalls = (prisma.perfil.update as jest.Mock).mock.calls;
      const hasDiariaUpdate = updateCalls.some((call: any[]) =>
        call[0]?.data?.rachaDiaria !== undefined,
      );
      expect(hasDiariaUpdate).toBe(false);
    });
  });
});
