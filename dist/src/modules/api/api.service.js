"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiService = void 0;
const common_1 = require("@nestjs/common");
let ApiService = class ApiService {
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
};
exports.ApiService = ApiService;
exports.ApiService = ApiService = __decorate([
    (0, common_1.Injectable)()
], ApiService);
//# sourceMappingURL=api.service.js.map