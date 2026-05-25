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
exports.IconosController = void 0;
const common_1 = require("@nestjs/common");
const iconos_service_1 = require("./iconos.service");
const create_icono_dto_1 = require("./dto/create-icono.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
let IconosController = class IconosController {
    iconosService;
    constructor(iconosService) {
        this.iconosService = iconosService;
    }
    findAll() {
        return this.iconosService.findAll();
    }
    create(dto) {
        return this.iconosService.create(dto);
    }
    getIconosUsuario(request) {
        return this.iconosService.getIconosUsuario(request.user.sub);
    }
    unlockIcono(request, idIcono) {
        return this.iconosService.unlockIcono(request.user.sub, idIcono);
    }
    comprarIcono(request, idIcono) {
        return this.iconosService.comprarIcono(request.user.sub, idIcono);
    }
    getIconoActivo(request) {
        return this.iconosService.getIconoActivo(request.user.sub);
    }
    setIconoActivo(request, idIcono) {
        return this.iconosService.setIconoActivo(request.user.sub, idIcono);
    }
};
exports.IconosController = IconosController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IconosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_icono_dto_1.CreateIconoDto]),
    __metadata("design:returntype", void 0)
], IconosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('usuario'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], IconosController.prototype, "getIconosUsuario", null);
__decorate([
    (0, common_1.Post)('usuario/:idIcono'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('idIcono', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], IconosController.prototype, "unlockIcono", null);
__decorate([
    (0, common_1.Post)('comprar/:idIcono'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('idIcono', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], IconosController.prototype, "comprarIcono", null);
__decorate([
    (0, common_1.Get)('activo'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], IconosController.prototype, "getIconoActivo", null);
__decorate([
    (0, common_1.Patch)('activo'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('idIcono', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], IconosController.prototype, "setIconoActivo", null);
exports.IconosController = IconosController = __decorate([
    (0, common_1.Controller)('iconos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [iconos_service_1.IconosService])
], IconosController);
//# sourceMappingURL=iconos.controller.js.map