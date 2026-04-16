import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class FindProgresoQueryDto {
  @Type(() => Number)
  @IsInt({ message: 'El idUsuario es obligatorio y debe ser entero' })
  @Min(1)
  idUsuario!: number;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }

    return value;
  })
  @IsBoolean({ message: 'completado debe ser true o false' })
  completado?: boolean;
}
