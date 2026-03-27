import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class FindUserParamsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idUsuario!: number;
}
