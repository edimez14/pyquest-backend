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
exports.PistasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let PistasService = class PistasService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPistas(idEjercicio) {
        const ejercicio = await this.prisma.ejercicio.findUnique({
            where: { idEjercicio },
            select: { idEjercicio: true },
        });
        if (!ejercicio) {
            throw new common_1.NotFoundException('Ejercicio no encontrado');
        }
        return this.prisma.pista.findMany({
            where: { idEjercicio },
            orderBy: { orden: 'asc' },
            select: { idPista: true, orden: true, texto: true },
        });
    }
    async createPistas(idEjercicio, pistas) {
        const data = pistas.map((p) => ({
            idEjercicio,
            orden: p.orden,
            texto: p.texto,
        }));
        return this.prisma.pista.createMany({ data });
    }
    async replacePistas(idEjercicio, pistas) {
        const ejercicio = await this.prisma.ejercicio.findUnique({
            where: { idEjercicio },
            select: { idEjercicio: true },
        });
        if (!ejercicio) {
            throw new common_1.NotFoundException('Ejercicio no encontrado');
        }
        return this.prisma.$transaction(async (trx) => {
            await trx.pista.deleteMany({ where: { idEjercicio } });
            const data = pistas.map((p) => ({
                idEjercicio,
                orden: p.orden,
                texto: p.texto,
            }));
            return trx.pista.createMany({ data });
        });
    }
};
exports.PistasService = PistasService;
exports.PistasService = PistasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PistasService);
//# sourceMappingURL=pistas.service.js.map