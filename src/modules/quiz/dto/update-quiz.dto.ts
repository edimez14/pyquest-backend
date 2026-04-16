import { Transform, Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsBoolean,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
    ValidateNested,
} from 'class-validator';

class UpdateRespuestaDto {
    @Transform(({ value }: { value: unknown }) =>
        typeof value === 'string' ? value.trim() : value,
    )
    @IsString()
    @MaxLength(300)
    texto!: string;

    @IsBoolean()
    esCorrecta!: boolean;
}

class UpdatePreguntaDto {
    @Transform(({ value }: { value: unknown }) =>
        typeof value === 'string' ? value.trim() : value,
    )
    @IsString()
    @MaxLength(500)
    enunciado!: string;

    @IsArray()
    @ArrayMinSize(2, { message: 'Cada pregunta debe tener al menos 2 respuestas' })
    @ValidateNested({ each: true })
    @Type(() => UpdateRespuestaDto)
    respuestas!: UpdateRespuestaDto[];
}

export class UpdateQuizDto {
    @IsOptional()
    @Transform(({ value }: { value: unknown }) =>
        typeof value === 'string' ? value.trim() : value,
    )
    @IsString()
    @MinLength(3)
    @MaxLength(180)
    titulo?: string;

    @IsOptional()
    @Transform(({ value }: { value: unknown }) =>
        typeof value === 'string' ? value.trim() : value,
    )
    @IsString()
    @MaxLength(1000)
    descripcion?: string;

    @IsOptional()
    @IsArray()
    @ArrayMinSize(1, { message: 'El quiz debe tener al menos una pregunta' })
    @ValidateNested({ each: true })
    @Type(() => UpdatePreguntaDto)
    preguntas?: UpdatePreguntaDto[];
}
