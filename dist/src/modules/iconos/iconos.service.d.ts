import { PrismaService } from '../../database/prisma.service';
import { PuntosService } from '../puntos/puntos.service';
import { CreateIconoDto } from './dto/create-icono.dto';
export declare class IconosService {
    private readonly prisma;
    private readonly puntosService;
    constructor(prisma: PrismaService, puntosService: PuntosService);
    findAll(): Promise<{
        descripcion: string | null;
        nombre: string;
        ruta: string;
        costo: number;
        idIcono: number;
    }[]>;
    create(dto: CreateIconoDto): Promise<{
        descripcion: string | null;
        nombre: string;
        ruta: string;
        costo: number;
        idIcono: number;
    }>;
    getIconosUsuario(idUsuario: number): Promise<({
        icono: {
            descripcion: string | null;
            nombre: string;
            ruta: string;
            costo: number;
            idIcono: number;
        };
    } & {
        idUsuario: number;
        idIcono: number;
        fechaDesbloqueo: Date;
    })[]>;
    unlockIcono(idUsuario: number, idIcono: number): Promise<{
        icono: {
            descripcion: string | null;
            nombre: string;
            ruta: string;
            costo: number;
            idIcono: number;
        };
    } & {
        idUsuario: number;
        idIcono: number;
        fechaDesbloqueo: Date;
    }>;
    comprarIcono(idUsuario: number, idIcono: number): Promise<{
        icono: {
            descripcion: string | null;
            nombre: string;
            ruta: string;
            costo: number;
            idIcono: number;
        };
    } & {
        idUsuario: number;
        idIcono: number;
        fechaDesbloqueo: Date;
    }>;
    getIconoActivo(idUsuario: number): Promise<{
        descripcion: string | null;
        nombre: string;
        ruta: string;
        costo: number;
        idIcono: number;
    } | null>;
    setIconoActivo(idUsuario: number, idIcono: number): Promise<{
        iconoActivo: {
            descripcion: string | null;
            nombre: string;
            ruta: string;
            costo: number;
            idIcono: number;
        } | null;
        idIconoActivo: number | null;
    }>;
}
