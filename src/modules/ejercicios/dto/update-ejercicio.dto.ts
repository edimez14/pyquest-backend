import { Transform } from 'class-transformer';
import {
    IsEnum,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import { DificultadEjercicio } from '@prisma/client';

export class UpdateEjercicioDto {
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
    @MinLength(5)
    @MaxLength(2000)
    descripcion?: string;

    @IsOptional()
    @Transform(({ value }: { value: unknown }) =>
        typeof value === 'string' ? value.trim().toUpperCase() : value,
    )
    @IsEnum(DificultadEjercicio, {
        message: 'La dificultad debe ser BAJO, MEDIO o ALTO',
    })
    dificultad?: DificultadEjercicio;

    @IsOptional()
    @Transform(({ value }: { value: unknown }) =>
        typeof value === 'string' ? value.trim().toLowerCase() : value,
    )
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    categoria?: string;
}
