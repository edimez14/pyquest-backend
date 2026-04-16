import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class ValidarEjercicioDto {
  @Type(() => Number)
  @IsInt({ message: 'El idUsuario debe ser un número entero' })
  @Min(1, { message: 'El idUsuario debe ser mayor o igual a 1' })
  idUsuario!: number;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty({ message: 'La respuesta es obligatoria' })
  @MaxLength(20000)
  respuesta!: string;
}
