-- Rename experiencia column to puntos in perfiles
ALTER TABLE "perfiles" RENAME COLUMN "experiencia" TO "puntos";

-- Create transacciones_puntos table
CREATE TABLE "transacciones_puntos" (
    "id_transaccion" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255),
    "id_ejercicio" INTEGER,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transacciones_puntos_pkey" PRIMARY KEY ("id_transaccion")
);

-- Create indexes for transacciones_puntos
CREATE INDEX "transacciones_puntos_id_usuario_idx" ON "transacciones_puntos"("id_usuario");
CREATE INDEX "transacciones_puntos_tipo_idx" ON "transacciones_puntos"("tipo");
CREATE INDEX "transacciones_puntos_fecha_idx" ON "transacciones_puntos"("fecha");

-- Add foreign key
ALTER TABLE "transacciones_puntos" ADD CONSTRAINT "transacciones_puntos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
