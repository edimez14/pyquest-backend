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
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let JwtAuthGuard = class JwtAuthGuard {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new common_1.UnauthorizedException('Token de acceso requerido');
        }
        const jwtSecret = this.configService.get('jwtSecret') ?? '';
        if (!jwtSecret) {
            throw new common_1.UnauthorizedException('Configuración JWT inválida');
        }
        try {
            const jwtService = new jwt_1.JwtService({ secret: jwtSecret });
            const payload = await jwtService.verifyAsync(token);
            request.user = payload;
            return true;
        }
        catch {
            throw new common_1.UnauthorizedException('Token inválido o expirado');
        }
    }
    extractTokenFromHeader(request) {
        const authorizationHeader = request.headers.authorization;
        if (!authorizationHeader) {
            return null;
        }
        const [type, token] = authorizationHeader.split(' ');
        if (type !== 'Bearer' || !token) {
            return null;
        }
        return token;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map