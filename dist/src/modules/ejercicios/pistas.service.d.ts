import { PrismaService } from '../../database/prisma.service';
import { PistaItemDto } from './dto/pista.dto';
export declare class PistasService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getPistas(idEjercicio: number): Promise<{
        orden: number;
        texto: string;
        idPista: number;
    }[]>;
    createPistas(idEjercicio: number, pistas: PistaItemDto[]): Promise<import("@prisma/client").Prisma.BatchPayload>;
    replacePistas(idEjercicio: number, pistas: PistaItemDto[]): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
