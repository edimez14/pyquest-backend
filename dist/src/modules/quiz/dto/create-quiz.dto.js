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
exports.CreateQuizDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateRespuestaDto {
    texto;
    esCorrecta;
}
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El texto de la respuesta es obligatorio' }),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreateRespuestaDto.prototype, "texto", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateRespuestaDto.prototype, "esCorrecta", void 0);
class CreatePreguntaDto {
    enunciado;
    respuestas;
}
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El enunciado es obligatorio' }),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreatePreguntaDto.prototype, "enunciado", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(2, { message: 'Cada pregunta debe tener al menos 2 respuestas' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateRespuestaDto),
    __metadata("design:type", Array)
], CreatePreguntaDto.prototype, "respuestas", void 0);
class CreateQuizDto {
    titulo;
    descripcion;
    preguntas;
}
exports.CreateQuizDto = CreateQuizDto;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El título es obligatorio' }),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(180),
    __metadata("design:type", String)
], CreateQuizDto.prototype, "titulo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateQuizDto.prototype, "descripcion", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'El quiz debe tener al menos una pregunta' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreatePreguntaDto),
    __metadata("design:type", Array)
], CreateQuizDto.prototype, "preguntas", void 0);
//# sourceMappingURL=create-quiz.dto.js.map