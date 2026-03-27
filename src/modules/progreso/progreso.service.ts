import { Injectable } from '@nestjs/common';

@Injectable()
export class ProgresoService {
  findAll() {
    return { message: 'Módulo progreso listo' };
  }
}
