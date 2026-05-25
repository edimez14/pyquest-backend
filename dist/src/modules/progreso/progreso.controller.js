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
exports.ProgresoController = void 0;
const common_1 = require("@nestjs/common");
const progreso_service_1 = require("./progreso.service");
const find_progreso_query_dto_1 = require("./dto/find-progreso-query.dto");
const find_progreso_params_dto_1 = require("./dto/find-progreso-params.dto");
const upsert_progreso_dto_1 = require("./dto/upsert-progreso.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
let ProgresoController = class ProgresoController {
    progresoService;
    constructor(progresoService) {
        this.progresoService = progresoService;
    }
    findAll(query) {
        return this.progresoService.findAll(query);
    }
    findOne(params) {
        return this.progresoService.findOne(params.idProgreso);
    }
    upsert(dto) {
        return this.progresoService.upsert(dto);
    }
    remove(params) {
        return this.progresoService.remove(params.idProgreso);
    }
};
exports.ProgresoController = ProgresoController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_progreso_query_dto_1.FindProgresoQueryDto]),
    __metadata("design:returntype", void 0)
], ProgresoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':idProgreso'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_progreso_params_dto_1.FindProgresoParamsDto]),
    __metadata("design:returntype", void 0)
], ProgresoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upsert_progreso_dto_1.UpsertProgresoDto]),
    __metadata("design:returntype", void 0)
], ProgresoController.prototype, "upsert", null);
__decorate([
    (0, common_1.Delete)(':idProgreso'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_progreso_params_dto_1.FindProgresoParamsDto]),
    __metadata("design:returntype", void 0)
], ProgresoController.prototype, "remove", null);
exports.ProgresoController = ProgresoController = __decorate([
    (0, common_1.Controller)('progreso'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [progreso_service_1.ProgresoService])
], ProgresoController);
//# sourceMappingURL=progreso.controller.js.map