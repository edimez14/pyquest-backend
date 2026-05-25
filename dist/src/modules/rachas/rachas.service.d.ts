import { PrismaService } from '../../database/prisma.service';
import { RachasResponseDto } from './dto/rachas-response.dto';
export declare class RachasService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    obtenerRachas(idUsuario: number): Promise<RachasResponseDto>;
    actualizarRachas(idUsuario: number, esCorrecto: boolean): Promise<void>;
    private incrementarRachaConsecutiva;
    private reiniciarRachaConsecutiva;
    private actualizarRachaDiaria;
    fechaSinHora(fecha: Date): Date;
    diferenciaEnDias(fecha1: Date, fecha2: Date): number;
}
