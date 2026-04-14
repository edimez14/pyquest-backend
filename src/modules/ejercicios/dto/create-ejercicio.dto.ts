import { Transform } from 'class-transformer';
import {
    IsEnum,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import { DificultadEjercicio } from '@prisma/client';

export class CreateEjercicioDto {
    @Transform(({ value }: { value: unknown }) =>
        typeof value === 'string' ? value.trim() : value,
    )
    @IsString()
    @IsNotEmpty({ message: 'El título es obligatorio' })
    @MinLength(3)
    @MaxLength(180)
    titulo!: string;

    @Transform(({ value }: { value: unknown }) =>
        typeof value === 'string' ? value.trim() : value,
    )
    @IsString()
    @IsNotEmpty({ message: 'La descripción es obligatoria' })
    @MinLength(5)
    @MaxLength(2000)
    descripcion!: string;

    @Transform(({ value }: { value: unknown }) =>
        typeof value === 'string' ? value.trim().toUpperCase() : value,
    )
    @IsEnum(DificultadEjercicio, {
        message: 'La dificultad debe ser BAJO, MEDIO o ALTO',
    })
    dificultad!: DificultadEjercicio;

    @Transform(({ value }: { value: unknown }) =>
        typeof value === 'string' ? value.trim().toLowerCase() : value,
    )
    @IsString()
    @IsNotEmpty({ message: 'La categoría es obligatoria' })
    @MinLength(2)
    @MaxLength(100)
    categoria!: string;
}
