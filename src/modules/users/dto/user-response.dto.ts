export interface UserResponseDto {
  idUsuario: number;
  nombre: string;
  email: string;
  fechaCreado: Date;
  perfil: {
    nivel: number;
    experiencia: number;
    racha: number;
  } | null;
}
