import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, Min, ValidateNested } from 'class-validator';

class RespuestaSeleccionadaDto {
    @Type(() => Number)
    @IsInt({ message: 'El idPregunta debe ser un número entero' })
    @Min(1)
    idPregunta!: number;

    @Type(() => Number)
    @IsInt({ message: 'El idRespuesta debe ser un número entero' })
    @Min(1)
    idRespuesta!: number;
}

export class ResponderQuizDto {
    @IsArray()
    @ArrayMinSize(1, { message: 'Debes enviar al menos una respuesta' })
    @ValidateNested({ each: true })
    @Type(() => RespuestaSeleccionadaDto)
    respuestas!: RespuestaSeleccionadaDto[];
}
