"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreService = void 0;
const common_1 = require("@nestjs/common");
let CoreService = class CoreService {
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
};
exports.CoreService = CoreService;
exports.CoreService = CoreService = __decorate([
    (0, common_1.Injectable)()
], CoreService);
//# sourceMappingURL=core.service.js.map