import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiService {
  getInfo() {
    return {
      name: 'PyQuest API',
      version: '1.0.0',
      status: 'active',
      timestamp: new Date().toISOString(),
    };
  }

  getEndpoints() {
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
      core: ['/api/core/health', '/api/core/routes'],
    };
  }
}
