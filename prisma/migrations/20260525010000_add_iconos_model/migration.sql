-- Migration: add_iconos_model
-- Adds iconos, usuarios_iconos tables and id_icono_activo on perfiles

CREATE TABLE "iconos" (
    "id_icono" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "ruta" VARCHAR(255) NOT NULL,
    "descripcion" VARCHAR(255),

    CONSTRAINT "iconos_pkey" PRIMARY KEY ("id_icono")
);

CREATE TABLE "usuarios_iconos" (
    "id_usuario" INTEGER NOT NULL,
    "id_icono" INTEGER NOT NULL,
    "fecha_desbloqueo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_iconos_pkey" PRIMARY KEY ("id_usuario","id_icono")
);

CREATE INDEX "usuarios_iconos_id_usuario_idx" ON "usuarios_iconos"("id_usuario");
CREATE INDEX "usuarios_iconos_id_icono_idx" ON "usuarios_iconos"("id_icono");

ALTER TABLE "usuarios_iconos" ADD CONSTRAINT "usuarios_iconos_id_usuario_fkey"
    FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "usuarios_iconos" ADD CONSTRAINT "usuarios_iconos_id_icono_fkey"
    FOREIGN KEY ("id_icono") REFERENCES "iconos"("id_icono")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "perfiles" ADD COLUMN "id_icono_activo" INTEGER;

CREATE INDEX "perfiles_id_icono_activo_idx" ON "perfiles"("id_icono_activo");

ALTER TABLE "perfiles" ADD CONSTRAINT "perfiles_id_icono_activo_fkey"
    FOREIGN KEY ("id_icono_activo") REFERENCES "iconos"("id_icono")
    ON DELETE SET NULL ON UPDATE CASCADE;
