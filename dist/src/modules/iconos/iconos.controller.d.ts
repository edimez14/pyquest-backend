import { IconosService } from './iconos.service';
import { CreateIconoDto } from './dto/create-icono.dto';
export declare class IconosController {
    private readonly iconosService;
    constructor(iconosService: IconosService);
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
    getIconosUsuario(request: Request & {
        user?: {
            sub: number;
        };
    }): Promise<({
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
    unlockIcono(request: Request & {
        user?: {
            sub: number;
        };
    }, idIcono: number): Promise<{
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
    comprarIcono(request: Request & {
        user?: {
            sub: number;
        };
    }, idIcono: number): Promise<{
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
    getIconoActivo(request: Request & {
        user?: {
            sub: number;
        };
    }): Promise<{
        descripcion: string | null;
        nombre: string;
        ruta: string;
        costo: number;
        idIcono: number;
    } | null>;
    setIconoActivo(request: Request & {
        user?: {
            sub: number;
        };
    }, idIcono: number): Promise<{
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
