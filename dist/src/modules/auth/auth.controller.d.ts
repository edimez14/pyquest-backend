import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
