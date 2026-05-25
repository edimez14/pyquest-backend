"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EjerciciosModule = void 0;
const common_1 = require("@nestjs/common");
const ejercicios_controller_1 = require("./ejercicios.controller");
const ejercicios_service_1 = require("./ejercicios.service");
const pistas_service_1 = require("./pistas.service");
const database_module_1 = require("../../database/database.module");
const rachas_module_1 = require("../rachas/rachas.module");
const puntos_module_1 = require("../puntos/puntos.module");
let EjerciciosModule = class EjerciciosModule {
};
exports.EjerciciosModule = EjerciciosModule;
exports.EjerciciosModule = EjerciciosModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, rachas_module_1.RachasModule, puntos_module_1.PuntosModule],
        controllers: [ejercicios_controller_1.EjerciciosController],
        providers: [ejercicios_service_1.EjerciciosService, pistas_service_1.PistasService],
    })
], EjerciciosModule);
//# sourceMappingURL=ejercicios.module.js.map