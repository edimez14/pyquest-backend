"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EjerciciosController = void 0;
const common_1 = require("@nestjs/common");
const ejercicios_service_1 = require("./ejercicios.service");
const pistas_service_1 = require("./pistas.service");
const create_ejercicio_dto_1 = require("./dto/create-ejercicio.dto");
const update_ejercicio_dto_1 = require("./dto/update-ejercicio.dto");
const find_ejercicio_params_dto_1 = require("./dto/find-ejercicio-params.dto");
const find_ejercicios_query_dto_1 = require("./dto/find-ejercicios-query.dto");
const validar_ejercicio_dto_1 = require("./dto/validar-ejercicio.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
let EjerciciosController = class EjerciciosController {
    ejerciciosService;
    pistasService;
    constructor(ejerciciosService, pistasService) {
        this.ejerciciosService = ejerciciosService;
        this.pistasService = pistasService;
    }
    findAll(query) {
        return this.ejerciciosService.findAll(query);
    }
    findOne(params) {
        return this.ejerciciosService.findOne(params.idEjercicio);
    }
    getPistas(params) {
        return this.pistasService.getPistas(params.idEjercicio);
    }
    create(dto) {
        return this.ejerciciosService.create(dto);
    }
    validar(params, dto) {
        return this.ejerciciosService.validarRespuesta(params.idEjercicio, dto);
    }
    update(params, dto) {
        return this.ejerciciosService.update(params.idEjercicio, dto);
    }
    remove(params) {
        return this.ejerciciosService.remove(params.idEjercicio);
    }
};
exports.EjerciciosController = EjerciciosController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_ejercicios_query_dto_1.FindEjerciciosQueryDto]),
    __metadata("design:returntype", void 0)
], EjerciciosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':idEjercicio'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_ejercicio_params_dto_1.FindEjercicioParamsDto]),
    __metadata("design:returntype", void 0)
], EjerciciosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':idEjercicio/pistas'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_ejercicio_params_dto_1.FindEjercicioParamsDto]),
    __metadata("design:returntype", void 0)
], EjerciciosController.prototype, "getPistas", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ejercicio_dto_1.CreateEjercicioDto]),
    __metadata("design:returntype", void 0)
], EjerciciosController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':idEjercicio/validar'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_ejercicio_params_dto_1.FindEjercicioParamsDto,
        validar_ejercicio_dto_1.ValidarEjercicioDto]),
    __metadata("design:returntype", void 0)
], EjerciciosController.prototype, "validar", null);
__decorate([
    (0, common_1.Patch)(':idEjercicio'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_ejercicio_params_dto_1.FindEjercicioParamsDto,
        update_ejercicio_dto_1.UpdateEjercicioDto]),
    __metadata("design:returntype", void 0)
], EjerciciosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':idEjercicio'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_ejercicio_params_dto_1.FindEjercicioParamsDto]),
    __metadata("design:returntype", void 0)
], EjerciciosController.prototype, "remove", null);
exports.EjerciciosController = EjerciciosController = __decorate([
    (0, common_1.Controller)('ejercicios'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [ejercicios_service_1.EjerciciosService,
        pistas_service_1.PistasService])
], EjerciciosController);
//# sourceMappingURL=ejercicios.controller.js.map