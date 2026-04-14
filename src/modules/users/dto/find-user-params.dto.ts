import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class FindUserParamsDto {
  @Type(() => Number)
  @IsInt({ message: 'El idUsuario debe ser un número entero' })
  @Min(1, { message: 'El idUsuario debe ser mayor o igual a 1' })
  idUsuario!: number;
}
