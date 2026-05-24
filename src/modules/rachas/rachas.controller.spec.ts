import { Test, TestingModule } from '@nestjs/testing';
import { RachasController } from './rachas.controller';
import { RachasService } from './rachas.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

describe('RachasController', () => {
  let controller: RachasController;
  let rachasService: RachasService;

  const mockRachasResponse = {
    rachaDiaria: 5,
    rachaDiariaMax: 10,
    rachaConsecutiva: 3,
    rachaConsecutivaMax: 8,
    inicioRachaDiaria: new Date('2025-06-10T00:00:00Z'),
    inicioRachaConsecutiva: new Date('2025-06-14T00:00:00Z'),
    fechaUltimoEjercicio: new Date('2025-06-15T12:00:00Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RachasController],
      providers: [
        {
          provide: RachasService,
          useValue: {
            obtenerRachas: jest.fn().mockResolvedValue(mockRachasResponse),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<RachasController>(RachasController);
    rachasService = module.get<RachasService>(RachasService);
  });

  describe('GET /rachas', () => {
    it('debe retornar las rachas del usuario autenticado', async () => {
      const request = { user: { sub: 1 } } as any;

      const result = await controller.obtenerRachas(request);

      expect(result).toEqual(mockRachasResponse);
      expect(rachasService.obtenerRachas).toHaveBeenCalledWith(1);
    });

    it('debe usar el idUsuario del token JWT', async () => {
      const request = { user: { sub: 42 } } as any;

      await controller.obtenerRachas(request);

      expect(rachasService.obtenerRachas).toHaveBeenCalledWith(42);
    });
  });
});
