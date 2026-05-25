import { Type, Transform } from 'class-transformer';
import {
    ArrayMaxSize,
    ArrayMinSize,
    IsEnum,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
    ValidateNested,
} from 'class-validator';
import { DificultadEjercicio } from '@prisma/client';
import { PistaItemDto } from './pista.dto';

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

    @IsOptional()
    @IsString()
    @MaxLength(20000)
    patronValidacion?: string;

    @IsOptional()
    @IsString()
    @MaxLength(20000)
    outputEsperado?: string;

    @IsOptional()
    @IsString()
    @MaxLength(5000)
    stdin?: string;

    // Opcional en update, pero si se proporcionan, deben ser exactamente 3
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => PistaItemDto)
    @ArrayMinSize(3, { message: 'Debe proporcionar exactamente 3 pistas' })
    @ArrayMaxSize(3, { message: 'Debe proporcionar exactamente 3 pistas' })
    pistas?: PistaItemDto[];
}
