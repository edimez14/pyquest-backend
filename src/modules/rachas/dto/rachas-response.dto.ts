export interface RachasResponseDto {
  rachaDiaria: number;
  rachaDiariaMax: number;
  rachaConsecutiva: number;
  rachaConsecutivaMax: number;
  inicioRachaDiaria: Date | null;
  inicioRachaConsecutiva: Date | null;
  fechaUltimoEjercicio: Date | null;
}
