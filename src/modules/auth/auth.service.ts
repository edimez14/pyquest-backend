import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  register(registerDto: RegisterDto) {
    return {
      message: 'Registro base listo',
      user: {
        nombre: registerDto.nombre,
        email: registerDto.email,
      },
    };
  }

  login(loginDto: LoginDto) {
    return {
      message: 'Login base listo',
      user: {
        email: loginDto.email,
      },
    };
  }
}
