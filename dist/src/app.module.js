"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const env_config_1 = require("./config/env.config");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const ejercicios_module_1 = require("./modules/ejercicios/ejercicios.module");
const quiz_module_1 = require("./modules/quiz/quiz.module");
const progreso_module_1 = require("./modules/progreso/progreso.module");
const database_module_1 = require("./database/database.module");
const compiler_module_1 = require("./modules/compiler/compiler.module");
const core_module_1 = require("./modules/core/core.module");
const api_module_1 = require("./modules/api/api.module");
const rachas_module_1 = require("./modules/rachas/rachas.module");
const puntos_module_1 = require("./modules/puntos/puntos.module");
const iconos_module_1 = require("./modules/iconos/iconos.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [env_config_1.envConfig],
            }),
            auth_module_1.AuthModule,
            database_module_1.DatabaseModule,
            users_module_1.UsersModule,
            ejercicios_module_1.EjerciciosModule,
            quiz_module_1.QuizModule,
            progreso_module_1.ProgresoModule,
            compiler_module_1.CompilerModule,
            core_module_1.CoreModule,
            api_module_1.ApiModule,
            rachas_module_1.RachasModule,
            puntos_module_1.PuntosModule,
            iconos_module_1.IconosModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map