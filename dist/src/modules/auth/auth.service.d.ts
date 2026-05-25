import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        accessToken: string;
        user: {
            idUsuario: number;
            nombre: string;
            email: string;
            fechaCreado: Date;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        accessToken: string;
        user: {
            idUsuario: number;
            nombre: string;
            email: string;
            perfil: {
                nivel: number;
                puntos: number;
                racha: number;
            } | null;
        };
    }>;
}
