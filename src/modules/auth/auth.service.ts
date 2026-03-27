import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  register() {
    return { message: 'Registro base listo' };
  }

  login() {
    return { message: 'Login base listo' };
  }
}
