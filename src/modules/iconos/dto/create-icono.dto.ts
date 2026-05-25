import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Max,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO para crear un icono en el catalogo
export class CreateIconoDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @MinLength(2)
    @MaxLength(100)
    nombre!: string;

    @IsString()
    @IsNotEmpty({ message: 'La ruta es obligatoria' })
    @MinLength(2)
    @MaxLength(255)
    ruta!: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    descripcion?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0, { message: 'El costo no puede ser negativo' })
    @Max(99999)
    costo?: number;
}
