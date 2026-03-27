import { Injectable } from '@nestjs/common';

@Injectable()
export class QuizService {
  findAll() {
    return { message: 'Módulo quiz listo' };
  }
}
