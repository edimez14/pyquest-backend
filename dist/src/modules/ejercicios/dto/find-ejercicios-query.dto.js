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
exports.FindEjerciciosQueryDto = void 0;
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class FindEjerciciosQueryDto {
    categoria;
    dificultad;
    limit;
}
exports.FindEjerciciosQueryDto = FindEjerciciosQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FindEjerciciosQueryDto.prototype, "categoria", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim().toUpperCase() : value),
    (0, class_validator_1.IsEnum)(client_1.DificultadEjercicio, {
        message: 'La dificultad debe ser BAJO, MEDIO o ALTO',
    }),
    __metadata("design:type", String)
], FindEjerciciosQueryDto.prototype, "dificultad", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'El límite debe ser un número entero' }),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], FindEjerciciosQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=find-ejercicios-query.dto.js.map