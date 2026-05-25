import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcryptjs';

describe('Pistas Integration (e2e)', () => {
    let app: INestApplication<App>;
    let prisma: PrismaService;
    let jwtService: JwtService;
    let accessToken: string;
    let ejercicioId: number;

    const testEmail = 'test_pistas@pyquest.dev';
    const testPassword = 'test123';

    beforeAll(async () => {
        jest.setTimeout(30000);
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        prisma = moduleFixture.get<PrismaService>(PrismaService);
        jwtService = moduleFixture.get<JwtService>(JwtService);
        await app.init();

        // Limpiar datos de prueba anteriores
        await prisma.pista.deleteMany({ where: { ejercicio: { titulo: 'TEST_PISTAS_EJERCICIO' } } });
        await prisma.solucion.deleteMany({ where: { ejercicio: { titulo: 'TEST_PISTAS_EJERCICIO' } } });
        await prisma.ejercicio.deleteMany({ where: { titulo: 'TEST_PISTAS_EJERCICIO' } });
        await prisma.perfil.deleteMany({ where: { usuario: { email: testEmail } } });
        await prisma.usuario.deleteMany({ where: { email: testEmail } });

        // Crear usuario de prueba
        const passwordHash = await hash(testPassword, 12);
        const usuario = await prisma.usuario.create({
            data: {
                nombre: 'Test Pistas',
                email: testEmail,
                passwordHash,
                perfil: {
                    create: { nivel: 1, puntos: 0, racha: 0 },
                },
            },
        });

        // Generar token JWT
        accessToken = await jwtService.signAsync({
            sub: usuario.idUsuario,
            email: usuario.email,
        });
    });

    afterAll(async () => {
        // Limpiar datos de prueba
        await prisma.pista.deleteMany({ where: { ejercicio: { titulo: 'TEST_PISTAS_EJERCICIO' } } });
        await prisma.solucion.deleteMany({ where: { ejercicio: { titulo: 'TEST_PISTAS_EJERCICIO' } } });
        await prisma.ejercicio.deleteMany({ where: { titulo: 'TEST_PISTAS_EJERCICIO' } });
        await prisma.perfil.deleteMany({ where: { usuario: { email: testEmail } } });
        await prisma.usuario.deleteMany({ where: { email: testEmail } });
        await app.close();
    });

    describe('GET /ejercicios/:idEjercicio/pistas', () => {
        beforeAll(async () => {
            // Crear un ejercicio con pistas para probar
            const res = await request(app.getHttpServer())
                .post('/ejercicios')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    titulo: 'TEST_PISTAS_EJERCICIO',
                    descripcion: 'Ejercicio de prueba para el endpoint de pistas',
                    dificultad: 'BAJO',
                    categoria: 'pruebas',
                    pistas: [
                        { orden: 1, texto: 'Pista numero uno: piensa en los fundamentos' },
                        { orden: 2, texto: 'Pista numero dos: revisa la sintaxis' },
                        { orden: 3, texto: 'Pista numero tres: verifica los casos borde' },
                    ],
                });

            ejercicioId = res.body.idEjercicio;
        });

        it('debe retornar 401 sin token', async () => {
            await request(app.getHttpServer())
                .get(`/ejercicios/${ejercicioId}/pistas`)
                .expect(401);
        });

        it('debe retornar las 3 pistas ordenadas', async () => {
            const res = await request(app.getHttpServer())
                .get(`/ejercicios/${ejercicioId}/pistas`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(res.body).toHaveLength(3);
            expect(res.body[0].orden).toBe(1);
            expect(res.body[0].texto).toBe('Pista numero uno: piensa en los fundamentos');
            expect(res.body[1].orden).toBe(2);
            expect(res.body[2].orden).toBe(3);
        });

        it('debe retornar 404 para ejercicio inexistente', async () => {
            await request(app.getHttpServer())
                .get('/ejercicios/99999/pistas')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(404);
        });
    });

    describe('POST /ejercicios - validacion de pistas', () => {
        it('debe rechazar si no se envian pistas', async () => {
            await request(app.getHttpServer())
                .post('/ejercicios')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    titulo: 'Ejercicio sin Pistas',
                    descripcion: 'Este ejercicio no tiene pistas',
                    dificultad: 'BAJO',
                    categoria: 'pruebas',
                })
                .expect(400);
        });

        it('debe rechazar si se envian menos de 3 pistas', async () => {
            await request(app.getHttpServer())
                .post('/ejercicios')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    titulo: 'Ejercicio con 2 Pistas',
                    descripcion: 'Ejercicio con pistas insuficientes',
                    dificultad: 'BAJO',
                    categoria: 'pruebas',
                    pistas: [
                        { orden: 1, texto: 'Primera pista' },
                        { orden: 2, texto: 'Segunda pista' },
                    ],
                })
                .expect(400);
        });

        it('debe rechazar si se envian mas de 3 pistas', async () => {
            await request(app.getHttpServer())
                .post('/ejercicios')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    titulo: 'Ejercicio con 4 Pistas',
                    descripcion: 'Ejercicio con pistas de mas',
                    dificultad: 'BAJO',
                    categoria: 'pruebas',
                    pistas: [
                        { orden: 1, texto: 'Primera pista' },
                        { orden: 2, texto: 'Segunda pista' },
                        { orden: 3, texto: 'Tercera pista' },
                        { orden: 4, texto: 'Cuarta pista extra' },
                    ],
                })
                .expect(400);
        });
    });
});
