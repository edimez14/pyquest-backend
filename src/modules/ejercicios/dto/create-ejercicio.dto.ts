import { Type, Transform } from 'class-transformer';
import {
    ArrayMaxSize,
    ArrayMinSize,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
    ValidateNested,
} from 'class-validator';
import { DificultadEjercicio } from '@prisma/client';
import { PistaItemDto } from './pista.dto';

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

    // Exactamente 3 pistas requeridas al crear un ejercicio
    @ValidateNested({ each: true })
    @Type(() => PistaItemDto)
    @ArrayMinSize(3, { message: 'Debe proporcionar exactamente 3 pistas' })
    @ArrayMaxSize(3, { message: 'Debe proporcionar exactamente 3 pistas' })
    pistas!: PistaItemDto[];
}
