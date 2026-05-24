import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcryptjs';
import { ValidationPipe } from '@nestjs/common';

describe('Rachas Integration (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let accessToken: string;
  let idUsuario: number;
  let idEjercicio: number;

  beforeAll(async () => {
    jest.setTimeout(30000);
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();

    // Limpiar datos de prueba anteriores
    await prisma.intento.deleteMany({ where: { usuario: { email: 'test_rachas@pyquest.dev' } } });
    await prisma.progresoUsuario.deleteMany({ where: { usuario: { email: 'test_rachas@pyquest.dev' } } });
    await prisma.perfil.deleteMany({ where: { usuario: { email: 'test_rachas@pyquest.dev' } } });
    await prisma.usuario.deleteMany({ where: { email: 'test_rachas@pyquest.dev' } });
    await prisma.solucion.deleteMany({ where: { ejercicio: { titulo: 'TEST_RACHAS_EJERCICIO' } } });
    await prisma.ejercicio.deleteMany({ where: { titulo: 'TEST_RACHAS_EJERCICIO' } });

    // Crear usuario de prueba
    const passwordHash = await hash('test123', 12);
    const usuario = await prisma.usuario.create({
      data: {
        nombre: 'Test Rachas',
        email: 'test_rachas@pyquest.dev',
        passwordHash,
        perfil: {
          create: {
            nivel: 1,
            experiencia: 0,
            racha: 0,
          },
        },
      },
    });
    idUsuario = usuario.idUsuario;

    // Crear ejercicio de prueba con solucion
    const ejercicio = await prisma.ejercicio.create({
      data: {
        titulo: 'TEST_RACHAS_EJERCICIO',
        descripcion: 'Ejercicio para pruebas de rachas',
        dificultad: 'BAJO',
        categoria: 'test',
        solucion: {
          create: {
            patronValidacion: 'respuesta_correcta',
          },
        },
      },
    });
    idEjercicio = ejercicio.idEjercicio;

    // Generar token JWT
    accessToken = await jwtService.signAsync({
      sub: idUsuario,
      email: usuario.email,
    });
  });

  afterAll(async () => {
    // Limpiar datos de prueba
    await prisma.intento.deleteMany({ where: { idUsuario } });
    await prisma.progresoUsuario.deleteMany({ where: { idUsuario } });
    await prisma.perfil.deleteMany({ where: { idUsuario } });
    await prisma.solucion.deleteMany({ where: { idEjercicio } });
    await prisma.ejercicio.deleteMany({ where: { idEjercicio } });
    await prisma.usuario.deleteMany({ where: { idUsuario } });
    await app.close();
  });

  describe('GET /rachas', () => {
    it('debe retornar 401 sin token', async () => {
      await request(app.getHttpServer())
        .get('/rachas')
        .expect(401);
    });

    it('debe retornar rachas iniciales en 0 para usuario nuevo', async () => {
      const response = await request(app.getHttpServer())
        .get('/rachas')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        rachaDiaria: 0,
        rachaDiariaMax: 0,
        rachaConsecutiva: 0,
        rachaConsecutivaMax: 0,
      });
    });
  });

  describe('Flujo: validar ejercicio afecta rachas', () => {
    it('respuesta correcta incrementa racha consecutiva y diaria', async () => {
      const res = await request(app.getHttpServer())
        .post(`/ejercicios/${idEjercicio}/validar`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ idUsuario, respuesta: 'respuesta_correcta' })
        .expect(201);

      expect(res.body.esCorrecto).toBe(true);

      // Verificar rachas
      const rachasRes = await request(app.getHttpServer())
        .get('/rachas')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(rachasRes.body.rachaConsecutiva).toBe(1);
      expect(rachasRes.body.rachaDiaria).toBe(1);
      expect(rachasRes.body.rachaConsecutivaMax).toBe(1);
      expect(rachasRes.body.rachaDiariaMax).toBe(1);
    });

    it('respuesta incorrecta reinicia racha consecutiva pero mantiene diaria', async () => {
      // Primero una correcta para establecer racha diaria
      await request(app.getHttpServer())
        .post(`/ejercicios/${idEjercicio}/validar`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ idUsuario, respuesta: 'respuesta_correcta' })
        .expect(201);

      // Luego una incorrecta
      await request(app.getHttpServer())
        .post(`/ejercicios/${idEjercicio}/validar`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ idUsuario, respuesta: 'respuesta_incorrecta' })
        .expect(201);

      const rachasRes = await request(app.getHttpServer())
        .get('/rachas')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Consecutiva se reinicia a 0
      expect(rachasRes.body.rachaConsecutiva).toBe(0);
      // Max consecutivo se mantiene en lo alcanzado previamente
      expect(rachasRes.body.rachaConsecutivaMax).toBeGreaterThanOrEqual(1);
      // Diaria no debe bajar (el mismo dia ya se conto)
      expect(rachasRes.body.rachaDiaria).toBeGreaterThanOrEqual(1);
    });

    it('maximos historicos se mantienen tras reinicio de racha', async () => {
      // Acertar 3 veces seguidas
      for (let i = 0; i < 3; i++) {
        await request(app.getHttpServer())
          .post(`/ejercicios/${idEjercicio}/validar`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ idUsuario, respuesta: 'respuesta_correcta' })
          .expect(201);
      }

      // Verificar maximo
      let rachasRes = await request(app.getHttpServer())
        .get('/rachas')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const maxConsecutivoAntes = rachasRes.body.rachaConsecutivaMax;

      // Fallar uno
      await request(app.getHttpServer())
        .post(`/ejercicios/${idEjercicio}/validar`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ idUsuario, respuesta: 'respuesta_incorrecta' })
        .expect(201);

      rachasRes = await request(app.getHttpServer())
        .get('/rachas')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Racha actual se reinicio
      expect(rachasRes.body.rachaConsecutiva).toBe(0);
      // Maximo historico se mantiene
      expect(rachasRes.body.rachaConsecutivaMax).toBe(maxConsecutivoAntes);
    });

    it('racha diaria no incrementa multiple veces el mismo dia', async () => {
      // Hacer varios ejercicios correctos el mismo dia
      await request(app.getHttpServer())
        .post(`/ejercicios/${idEjercicio}/validar`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ idUsuario, respuesta: 'respuesta_correcta' })
        .expect(201);

      const rachas1 = await request(app.getHttpServer())
        .get('/rachas')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Segundo ejercicio mismo dia
      await request(app.getHttpServer())
        .post(`/ejercicios/${idEjercicio}/validar`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ idUsuario, respuesta: 'respuesta_correcta' })
        .expect(201);

      const rachas2 = await request(app.getHttpServer())
        .get('/rachas')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // La racha diaria no debe haber cambiado (mismo dia)
      expect(rachas2.body.rachaDiaria).toBe(rachas1.body.rachaDiaria);
    });

    it('respuesta incorrecta no afecta racha diaria', async () => {
      const antes = await request(app.getHttpServer())
        .get('/rachas')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      await request(app.getHttpServer())
        .post(`/ejercicios/${idEjercicio}/validar`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ idUsuario, respuesta: 'respuesta_incorrecta' })
        .expect(201);

      const despues = await request(app.getHttpServer())
        .get('/rachas')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Racha diaria no debe cambiar con respuesta incorrecta
      expect(despues.body.rachaDiaria).toBe(antes.body.rachaDiaria);
      expect(despues.body.rachaDiariaMax).toBe(antes.body.rachaDiariaMax);
    });

    it('debe retornar 404 si el usuario no existe al validar', async () => {
      await request(app.getHttpServer())
        .post(`/ejercicios/${idEjercicio}/validar`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ idUsuario: 999999, respuesta: 'respuesta_correcta' })
        .expect(404);
    });
  });
});
