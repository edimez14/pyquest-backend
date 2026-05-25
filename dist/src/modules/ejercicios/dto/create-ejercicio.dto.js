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
exports.CreateEjercicioDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const pista_dto_1 = require("./pista.dto");
class CreateEjercicioDto {
    titulo;
    descripcion;
    dificultad;
    categoria;
    pistas;
}
exports.CreateEjercicioDto = CreateEjercicioDto;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El título es obligatorio' }),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(180),
    __metadata("design:type", String)
], CreateEjercicioDto.prototype, "titulo", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La descripción es obligatoria' }),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CreateEjercicioDto.prototype, "descripcion", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim().toUpperCase() : value),
    (0, class_validator_1.IsEnum)(client_1.DificultadEjercicio, {
        message: 'La dificultad debe ser BAJO, MEDIO o ALTO',
    }),
    __metadata("design:type", String)
], CreateEjercicioDto.prototype, "dificultad", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La categoría es obligatoria' }),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateEjercicioDto.prototype, "categoria", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => pista_dto_1.PistaItemDto),
    (0, class_validator_1.ArrayMinSize)(3, { message: 'Debe proporcionar exactamente 3 pistas' }),
    (0, class_validator_1.ArrayMaxSize)(3, { message: 'Debe proporcionar exactamente 3 pistas' }),
    __metadata("design:type", Array)
], CreateEjercicioDto.prototype, "pistas", void 0);
//# sourceMappingURL=create-ejercicio.dto.js.map