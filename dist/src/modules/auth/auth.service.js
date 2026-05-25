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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const bcryptjs_1 = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const email = registerDto.email.toLowerCase().trim();
        const exists = await this.prisma.usuario.findUnique({
            where: { email },
            select: { idUsuario: true },
        });
        if (exists) {
            throw new common_1.ConflictException('El correo ya está registrado');
        }
        const passwordHash = await (0, bcryptjs_1.hash)(registerDto.password, 12);
        const user = await this.prisma.usuario.create({
            data: {
                nombre: registerDto.nombre.trim(),
                email,
                passwordHash,
                perfil: {
                    create: {
                        nivel: 1,
                        puntos: 0,
                        racha: 0,
                    },
                },
            },
            include: {
                perfil: true,
            },
        });
        const accessToken = await this.jwtService.signAsync({
            sub: user.idUsuario,
            email: user.email,
        });
        return {
            message: 'Registro exitoso',
            accessToken,
            user: {
                idUsuario: user.idUsuario,
                nombre: user.nombre,
                email: user.email,
                fechaCreado: user.fechaCreado,
            },
        };
    }
    async login(loginDto) {
        const email = loginDto.email.toLowerCase().trim();
        const user = await this.prisma.usuario.findUnique({
            where: { email },
            include: {
                perfil: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const passwordMatch = await (0, bcryptjs_1.compare)(loginDto.password, user.passwordHash);
        if (!passwordMatch) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const accessToken = await this.jwtService.signAsync({
            sub: user.idUsuario,
            email: user.email,
        });
        return {
            message: 'Login exitoso',
            accessToken,
            user: {
                idUsuario: user.idUsuario,
                nombre: user.nombre,
                email: user.email,
                perfil: user.perfil
                    ? {
                        nivel: user.perfil.nivel,
                        puntos: user.perfil.puntos,
                        racha: user.perfil.racha,
                    }
                    : null,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map