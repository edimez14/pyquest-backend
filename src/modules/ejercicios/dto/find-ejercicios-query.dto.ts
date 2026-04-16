import { Transform, Type } from 'class-transformer';
import { DificultadEjercicio } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class FindEjerciciosQueryDto {
    @IsOptional()
    @Transform(({ value }: { value: unknown }) =>
        typeof value === 'string' ? value.trim().toLowerCase() : value,
    )
    @IsString()
    categoria?: string;

    @IsOptional()
    @Transform(({ value }: { value: unknown }) =>
        typeof value === 'string' ? value.trim().toUpperCase() : value,
    )
    @IsEnum(DificultadEjercicio, {
        message: 'La dificultad debe ser BAJO, MEDIO o ALTO',
    })
    dificultad?: DificultadEjercicio;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'El límite debe ser un número entero' })
    @Min(1)
    @Max(100)
    limit?: number;
}
