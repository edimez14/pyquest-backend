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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreController = void 0;
const common_1 = require("@nestjs/common");
const core_service_1 = require("./core.service");
let CoreController = class CoreController {
    coreService;
    constructor(coreService) {
        this.coreService = coreService;
    }
    health() {
        return this.coreService.getHealth();
    }
    routes() {
        return this.coreService.getRoutes();
    }
};
exports.CoreController = CoreController;
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CoreController.prototype, "health", null);
__decorate([
    (0, common_1.Get)('routes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CoreController.prototype, "routes", null);
exports.CoreController = CoreController = __decorate([
    (0, common_1.Controller)('core'),
    __metadata("design:paramtypes", [core_service_1.CoreService])
], CoreController);
//# sourceMappingURL=core.controller.js.map