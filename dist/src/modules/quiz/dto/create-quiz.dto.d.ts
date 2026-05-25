declare class CreateRespuestaDto {
    texto: string;
    esCorrecta: boolean;
}
declare class CreatePreguntaDto {
    enunciado: string;
    respuestas: CreateRespuestaDto[];
}
export declare class CreateQuizDto {
    titulo: string;
    descripcion?: string;
    preguntas: CreatePreguntaDto[];
}
export {};
