import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class FindProgresoParamsDto {
    @Type(() => Number)
    @IsInt({ message: 'El idProgreso debe ser un número entero' })
    @Min(1, { message: 'El idProgreso debe ser mayor o igual a 1' })
    idProgreso!: number;
}
