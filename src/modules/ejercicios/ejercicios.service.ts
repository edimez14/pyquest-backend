import { Injectable } from '@nestjs/common';

@Injectable()
export class EjerciciosService {
  findAll() {
    return { message: 'Módulo ejercicios listo' };
  }
}
