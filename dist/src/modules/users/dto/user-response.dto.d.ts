export interface UserResponseDto {
    idUsuario: number;
    nombre: string;
    email: string;
    fechaCreado: Date;
    perfil: {
        nivel: number;
        puntos: number;
        racha: number;
    } | null;
}
