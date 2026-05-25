-- CreateTable
CREATE TABLE "pistas" (
    "id_pista" SERIAL NOT NULL,
    "id_ejercicio" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,

    CONSTRAINT "pistas_pkey" PRIMARY KEY ("id_pista")
);

-- CreateIndex
CREATE INDEX "pistas_id_ejercicio_idx" ON "pistas"("id_ejercicio");

-- CreateIndex
CREATE UNIQUE INDEX "pistas_id_ejercicio_orden_key" ON "pistas"("id_ejercicio", "orden");

-- AddForeignKey
ALTER TABLE "pistas" ADD CONSTRAINT "pistas_id_ejercicio_fkey" FOREIGN KEY ("id_ejercicio") REFERENCES "ejercicios"("id_ejercicio") ON DELETE CASCADE ON UPDATE CASCADE;
