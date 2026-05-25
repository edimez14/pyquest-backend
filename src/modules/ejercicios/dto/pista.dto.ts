import {
    IsInt,
    IsNotEmpty,
    IsString,
    Max,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';

// DTO para una pista individual en las validaciones anidadas
export class PistaItemDto {
    @IsInt({ message: 'El orden debe ser un número entero (1, 2 o 3)' })
    @Min(1, { message: 'El orden mínimo es 1' })
    @Max(3, { message: 'El orden máximo es 3' })
    orden!: number;

    @IsString()
    @IsNotEmpty({ message: 'El texto de la pista es obligatorio' })
    @MinLength(5)
    @MaxLength(500)
    texto!: string;
}
