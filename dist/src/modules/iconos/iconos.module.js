"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconosModule = void 0;
const common_1 = require("@nestjs/common");
const iconos_controller_1 = require("./iconos.controller");
const iconos_service_1 = require("./iconos.service");
const database_module_1 = require("../../database/database.module");
const puntos_module_1 = require("../puntos/puntos.module");
let IconosModule = class IconosModule {
};
exports.IconosModule = IconosModule;
exports.IconosModule = IconosModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, puntos_module_1.PuntosModule],
        controllers: [iconos_controller_1.IconosController],
        providers: [iconos_service_1.IconosService],
    })
], IconosModule);
//# sourceMappingURL=iconos.module.js.map