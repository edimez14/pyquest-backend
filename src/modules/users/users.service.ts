import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(idUsuario: number): Promise<UserResponseDto> {
    const user = await this.prisma.usuario.findUnique({
      where: { idUsuario },
      include: {
        perfil: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      idUsuario: user.idUsuario,
      nombre: user.nombre,
      email: user.email,
      fechaCreado: user.fechaCreado,
      perfil: user.perfil
        ? {
            nivel: user.perfil.nivel,
            experiencia: user.perfil.experiencia,
            racha: user.perfil.racha,
          }
        : null,
    };
  }
}
