declare class UpdateRespuestaDto {
    texto: string;
    esCorrecta: boolean;
}
declare class UpdatePreguntaDto {
    enunciado: string;
    respuestas: UpdateRespuestaDto[];
}
export declare class UpdateQuizDto {
    titulo?: string;
    descripcion?: string;
    preguntas?: UpdatePreguntaDto[];
}
export {};
