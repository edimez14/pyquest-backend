import { Injectable } from '@nestjs/common';

@Injectable()
export class CoreService {
  getHealth() {
    return {
      status: 'ok',
      service: 'pyquest-backend',
      timestamp: new Date().toISOString(),
    };
  }

  getRoutes() {
    return {
      auth: ['/api/auth/register', '/api/auth/login'],
      users: ['/api/users/:idUsuario'],
      ejercicios: [
        '/api/ejercicios',
        '/api/ejercicios/:idEjercicio',
        '/api/ejercicios/:idEjercicio/validar',
      ],
      quiz: [
        '/api/quiz',
        '/api/quiz/:idQuiz',
        '/api/quiz/:idQuiz/responder',
      ],
      progreso: ['/api/progreso', '/api/progreso/:idProgreso'],
      compiler: ['/api/compiler/python/execute'],
    };
  }
}
