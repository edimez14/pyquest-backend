export interface PuntosResponseDto {
  puntos: number;
}

export interface TransaccionPuntosDto {
  idTransaccion: number;
  cantidad: number;
  tipo: string;
  descripcion: string | null;
  idEjercicio: number | null;
  fecha: Date;
}
