-- AlterTable
ALTER TABLE "perfiles" ADD COLUMN     "fecha_ultimo_ejercicio" TIMESTAMP(3),
ADD COLUMN     "inicio_racha_consecutiva" TIMESTAMP(3),
ADD COLUMN     "inicio_racha_diaria" TIMESTAMP(3),
ADD COLUMN     "racha_consecutiva" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "racha_consecutiva_max" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "racha_diaria" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "racha_diaria_max" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ultima_actualizacion_rachas" TIMESTAMP(3);
