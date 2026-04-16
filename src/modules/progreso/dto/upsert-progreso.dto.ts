import { Type } from 'class-transformer';
import { IsBoolean, IsInt, Min } from 'class-validator';

export class UpsertProgresoDto {
    @Type(() => Number)
    @IsInt({ message: 'El idUsuario debe ser un número entero' })
    @Min(1)
    idUsuario!: number;

    @Type(() => Number)
    @IsInt({ message: 'El idEjercicio debe ser un número entero' })
    @Min(1)
    idEjercicio!: number;

    @IsBoolean({ message: 'completado debe ser true o false' })
    completado!: boolean;
}
