import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class FindEjercicioParamsDto {
    @Type(() => Number)
    @IsInt({ message: 'El idEjercicio debe ser un número entero' })
    @Min(1, { message: 'El idEjercicio debe ser mayor o igual a 1' })
    idEjercicio!: number;
}
