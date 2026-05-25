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
exports.CompilerController = void 0;
const common_1 = require("@nestjs/common");
const compiler_service_1 = require("./compiler.service");
const run_python_dto_1 = require("./dto/run-python.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
let CompilerController = class CompilerController {
    compilerService;
    constructor(compilerService) {
        this.compilerService = compilerService;
    }
    executePython(payload) {
        return this.compilerService.executePython(payload);
    }
};
exports.CompilerController = CompilerController;
__decorate([
    (0, common_1.Post)('python/execute'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [run_python_dto_1.RunPythonDto]),
    __metadata("design:returntype", void 0)
], CompilerController.prototype, "executePython", null);
exports.CompilerController = CompilerController = __decorate([
    (0, common_1.Controller)('compiler'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [compiler_service_1.CompilerService])
], CompilerController);
//# sourceMappingURL=compiler.controller.js.map