import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PistaItemDto } from './dto/pista.dto';

@Injectable()
export class PistasService {
    constructor(private readonly prisma: PrismaService) { }

    // Obtiene las 3 pistas de un ejercicio, ordenadas por orden ascendente
    async getPistas(idEjercicio: number) {
        const ejercicio = await this.prisma.ejercicio.findUnique({
            where: { idEjercicio },
            select: { idEjercicio: true },
        });

        if (!ejercicio) {
            throw new NotFoundException('Ejercicio no encontrado');
        }

        return this.prisma.pista.findMany({
            where: { idEjercicio },
            orderBy: { orden: 'asc' },
            select: { idPista: true, orden: true, texto: true },
        });
    }

    // Crea las 3 pistas para un ejercicio recien creado
    async createPistas(idEjercicio: number, pistas: PistaItemDto[]) {
        const data = pistas.map((p) => ({
            idEjercicio,
            orden: p.orden,
            texto: p.texto,
        }));

        return this.prisma.pista.createMany({ data });
    }

    // Reemplaza todas las pistas de un ejercicio (borra las viejas, crea las nuevas)
    async replacePistas(idEjercicio: number, pistas: PistaItemDto[]) {
        const ejercicio = await this.prisma.ejercicio.findUnique({
            where: { idEjercicio },
            select: { idEjercicio: true },
        });

        if (!ejercicio) {
            throw new NotFoundException('Ejercicio no encontrado');
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
}
