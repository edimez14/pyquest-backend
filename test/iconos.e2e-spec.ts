import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcryptjs';

describe('Iconos Integration (e2e)', () => {
    let app: INestApplication<App>;
    let prisma: PrismaService;
    let jwtService: JwtService;
    let accessToken: string;
    let usuarioId: number;
    let iconoGratisId: number;
    let iconoPremiumId: number;

    const testEmail = 'test_iconos@pyquest.dev';
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
        await prisma.usuarioIcono.deleteMany({
            where: { usuario: { email: testEmail } },
        });
        await prisma.transaccionPuntos.deleteMany({
            where: { usuario: { email: testEmail } },
        });
        await prisma.perfil.deleteMany({
            where: { usuario: { email: testEmail } },
        });
        await prisma.usuario.deleteMany({ where: { email: testEmail } });
        await prisma.icono.deleteMany({
            where: { nombre: { in: ['TEST_ICONO_GRATIS', 'TEST_ICONO_PREMIUM'] } },
        });

        // Crear usuario de prueba con perfil y puntos suficientes para comprar
        const passwordHash = await hash(testPassword, 12);
        const usuario = await prisma.usuario.create({
            data: {
                nombre: 'Test Iconos',
                email: testEmail,
                passwordHash,
                perfil: {
                    create: { nivel: 1, puntos: 500, racha: 0 },
                },
            },
        });
        usuarioId = usuario.idUsuario;

        // Crear icono gratuito (costo 0)
        const iconoGratis = await prisma.icono.create({
            data: {
                nombre: 'TEST_ICONO_GRATIS',
                ruta: '/icons/gratis.svg',
                descripcion: 'Icono gratuito e2e',
                costo: 0,
            },
        });
        iconoGratisId = iconoGratis.idIcono;

        // Crear icono premium (costo > 0)
        const iconoPremium = await prisma.icono.create({
            data: {
                nombre: 'TEST_ICONO_PREMIUM',
                ruta: '/icons/premium.svg',
                descripcion: 'Icono premium e2e',
                costo: 100,
            },
        });
        iconoPremiumId = iconoPremium.idIcono;

        // Generar token JWT
        accessToken = await jwtService.signAsync({
            sub: usuarioId,
            email: usuario.email,
        });
    });

    afterAll(async () => {
        // Limpiar datos de prueba
        await prisma.usuarioIcono.deleteMany({
            where: { usuario: { email: testEmail } },
        });
        await prisma.transaccionPuntos.deleteMany({
            where: { usuario: { email: testEmail } },
        });
        await prisma.perfil.deleteMany({
            where: { usuario: { email: testEmail } },
        });
        await prisma.usuario.deleteMany({ where: { email: testEmail } });
        await prisma.icono.deleteMany({
            where: { nombre: { in: ['TEST_ICONO_GRATIS', 'TEST_ICONO_PREMIUM'] } },
        });
        await app.close();
    });

    describe('GET /iconos', () => {
        it('debe retornar 401 sin token', async () => {
            await request(app.getHttpServer())
                .get('/iconos')
                .expect(401);
        });

        it('debe retornar el catalogo de iconos con token valido (incluye costo)', async () => {
            const res = await request(app.getHttpServer())
                .get('/iconos')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(2);
            expect(res.body[0]).toHaveProperty('idIcono');
            expect(res.body[0]).toHaveProperty('nombre');
            expect(res.body[0]).toHaveProperty('ruta');
            expect(res.body[0]).toHaveProperty('costo');
        });
    });

    describe('POST /iconos', () => {
        it('debe retornar 401 sin token', async () => {
            await request(app.getHttpServer())
                .post('/iconos')
                .send({ nombre: 'Otro', ruta: '/icons/otro.svg' })
                .expect(401);
        });

        it('debe crear un icono en el catalogo con costo por defecto 0', async () => {
            const res = await request(app.getHttpServer())
                .post('/iconos')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    nombre: 'TEST_ICONO_NUEVO',
                    ruta: '/icons/nuevo.svg',
                    descripcion: 'Creado en e2e',
                })
                .expect(201);

            expect(res.body.nombre).toBe('TEST_ICONO_NUEVO');
            expect(res.body.ruta).toBe('/icons/nuevo.svg');
            expect(res.body.costo).toBe(0);
            expect(res.body).toHaveProperty('idIcono');

            // Limpiar icono creado
            await prisma.icono.delete({ where: { idIcono: res.body.idIcono } });
        });

        it('debe rechazar si falta el nombre', async () => {
            await request(app.getHttpServer())
                .post('/iconos')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ ruta: '/icons/sin-nombre.svg' })
                .expect(400);
        });
    });

    describe('GET /iconos/usuario', () => {
        it('debe retornar 401 sin token', async () => {
            await request(app.getHttpServer())
                .get('/iconos/usuario')
                .expect(401);
        });

        it('debe retornar array vacio si no hay iconos desbloqueados', async () => {
            const res = await request(app.getHttpServer())
                .get('/iconos/usuario')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body).toHaveLength(0);
        });

        it('debe retornar iconos desbloqueados despues de unlock', async () => {
            // Primero desbloquear icono gratuito
            await request(app.getHttpServer())
                .post(`/iconos/usuario/${iconoGratisId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(201);

            const res = await request(app.getHttpServer())
                .get('/iconos/usuario')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(res.body).toHaveLength(1);
            expect(res.body[0].icono.nombre).toBe('TEST_ICONO_GRATIS');
            expect(res.body[0].icono.costo).toBe(0);
            expect(res.body[0]).toHaveProperty('fechaDesbloqueo');
        });
    });

    describe('POST /iconos/usuario/:idIcono (unlockIcono - solo gratis)', () => {
        it('debe retornar 401 sin token', async () => {
            await request(app.getHttpServer())
                .post(`/iconos/usuario/${iconoGratisId}`)
                .expect(401);
        });

        it('debe desbloquear un icono gratuito (costo 0)', async () => {
            const res = await request(app.getHttpServer())
                .post(`/iconos/usuario/${iconoGratisId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(201);

            expect(res.body.icono.idIcono).toBe(iconoGratisId);
            expect(res.body.icono.nombre).toBe('TEST_ICONO_GRATIS');
        });

        it('debe rechazar desbloquear icono premium por esta via (costo > 0)', async () => {
            await request(app.getHttpServer())
                .post(`/iconos/usuario/${iconoPremiumId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(400);
        });

        it('debe retornar 404 si el icono no existe', async () => {
            await request(app.getHttpServer())
                .post('/iconos/usuario/99999')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(404);
        });
    });

    describe('POST /iconos/comprar/:idIcono (comprarIcono)', () => {
        it('debe retornar 401 sin token', async () => {
            await request(app.getHttpServer())
                .post(`/iconos/comprar/${iconoPremiumId}`)
                .expect(401);
        });

        it('debe comprar un icono premium y deducir puntos', async () => {
            const res = await request(app.getHttpServer())
                .post(`/iconos/comprar/${iconoPremiumId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(201);

            expect(res.body.icono.idIcono).toBe(iconoPremiumId);
            expect(res.body.icono.nombre).toBe('TEST_ICONO_PREMIUM');
            expect(res.body.icono.costo).toBe(100);

            // Verificar que se dedujeron los puntos
            const perfil = await prisma.perfil.findUnique({
                where: { idUsuario: usuarioId },
                select: { puntos: true },
            });
            expect(perfil!.puntos).toBe(400); // 500 - 100
        });

        it('debe rechazar comprar icono gratuito por esta via', async () => {
            await request(app.getHttpServer())
                .post(`/iconos/comprar/${iconoGratisId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(400);
        });

        it('debe rechazar comprar icono ya poseido', async () => {
            await request(app.getHttpServer())
                .post(`/iconos/comprar/${iconoPremiumId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(400);
        });

        it('debe retornar 404 si el icono no existe', async () => {
            await request(app.getHttpServer())
                .post('/iconos/comprar/99999')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(404);
        });
    });

    describe('GET /iconos/activo', () => {
        it('debe retornar 401 sin token', async () => {
            await request(app.getHttpServer())
                .get('/iconos/activo')
                .expect(401);
        });

        it('debe retornar icono activo del perfil', async () => {
            const res = await request(app.getHttpServer())
                .get('/iconos/activo')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            // Inicialmente sin icono activo
            expect(res.body).toEqual({});
        });
    });

    describe('PATCH /iconos/activo', () => {
        it('debe retornar 401 sin token', async () => {
            await request(app.getHttpServer())
                .patch('/iconos/activo')
                .send({ idIcono: iconoGratisId })
                .expect(401);
        });

        it('debe establecer un icono activo en el perfil (si lo posee)', async () => {
            const res = await request(app.getHttpServer())
                .patch('/iconos/activo')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ idIcono: iconoGratisId })
                .expect(200);

            expect(res.body.idIconoActivo).toBe(iconoGratisId);
            expect(res.body.iconoActivo.nombre).toBe('TEST_ICONO_GRATIS');
        });

        it('debe reflejar el cambio en GET /iconos/activo', async () => {
            const res = await request(app.getHttpServer())
                .get('/iconos/activo')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(res.body.idIcono).toBe(iconoGratisId);
            expect(res.body.nombre).toBe('TEST_ICONO_GRATIS');
        });

        it('debe rechazar icono no poseido', async () => {
            // Crear un icono que el usuario no posee
            const otroIcono = await prisma.icono.create({
                data: {
                    nombre: 'TEST_ICONO_NO_POSEIDO',
                    ruta: '/icons/no-poseido.svg',
                    costo: 200,
                },
            });

            await request(app.getHttpServer())
                .patch('/iconos/activo')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ idIcono: otroIcono.idIcono })
                .expect(400);

            // Limpiar
            await prisma.icono.delete({ where: { idIcono: otroIcono.idIcono } });
        });

        it('debe retornar 404 si el icono no existe', async () => {
            await request(app.getHttpServer())
                .patch('/iconos/activo')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ idIcono: 99999 })
                .expect(404);
        });
    });
});
