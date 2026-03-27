import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../../database/prisma.service';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const email = registerDto.email.toLowerCase().trim();

    const exists = await this.prisma.usuario.findUnique({
      where: { email },
      select: { idUsuario: true },
    });

    if (exists) {
      throw new ConflictException('El correo ya está registrado');
    }

    const passwordHash = await hash(registerDto.password, 12);

    const user = await this.prisma.usuario.create({
      data: {
        nombre: registerDto.nombre.trim(),
        email,
        passwordHash,
        perfil: {
          create: {
            nivel: 1,
            experiencia: 0,
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

  async login(loginDto: LoginDto) {
    const email = loginDto.email.toLowerCase().trim();

    const user = await this.prisma.usuario.findUnique({
      where: { email },
      include: {
        perfil: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordMatch = await compare(loginDto.password, user.passwordHash);

    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
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
              experiencia: user.perfil.experiencia,
              racha: user.perfil.racha,
            }
          : null,
      },
    };
  }
}
