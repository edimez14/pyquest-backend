import { Transform, Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
    ValidateNested,
} from 'class-validator';

class CreateRespuestaDto {
    @Transform(({ value }: { value: unknown }) =>
        typeof value === 'string' ? value.trim() : value,
    )
    @IsString()
    @IsNotEmpty({ message: 'El texto de la respuesta es obligatorio' })
    @MaxLength(300)
    texto!: string;

    @IsBoolean()
    esCorrecta!: boolean;
}

class CreatePreguntaDto {
    @Transform(({ value }: { value: unknown }) =>
        typeof value === 'string' ? value.trim() : value,
    )
    @IsString()
    @IsNotEmpty({ message: 'El enunciado es obligatorio' })
    @MaxLength(500)
    enunciado!: string;

    @IsArray()
    @ArrayMinSize(2, { message: 'Cada pregunta debe tener al menos 2 respuestas' })
    @ValidateNested({ each: true })
    @Type(() => CreateRespuestaDto)
    respuestas!: CreateRespuestaDto[];
}

export class CreateQuizDto {
    @Transform(({ value }: { value: unknown }) =>
        typeof value === 'string' ? value.trim() : value,
    )
    @IsString()
    @IsNotEmpty({ message: 'El título es obligatorio' })
    @MinLength(3)
    @MaxLength(180)
    titulo!: string;

    @IsOptional()
    @Transform(({ value }: { value: unknown }) =>
        typeof value === 'string' ? value.trim() : value,
    )
    @IsString()
    @MaxLength(1000)
    descripcion?: string;

    @IsArray()
    @ArrayMinSize(1, { message: 'El quiz debe tener al menos una pregunta' })
    @ValidateNested({ each: true })
    @Type(() => CreatePreguntaDto)
    preguntas!: CreatePreguntaDto[];
}
