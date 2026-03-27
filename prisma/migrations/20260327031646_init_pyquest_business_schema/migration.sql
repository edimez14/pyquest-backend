-- CreateEnum
CREATE TYPE "DificultadEjercicio" AS ENUM ('BAJO', 'MEDIO', 'ALTO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" VARCHAR(120) NOT NULL,
    "email" VARCHAR(180) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "fecha_creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "perfiles" (
    "id_perfil" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "nivel" INTEGER NOT NULL DEFAULT 1,
    "experiencia" INTEGER NOT NULL DEFAULT 0,
    "racha" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "perfiles_pkey" PRIMARY KEY ("id_perfil")
);

-- CreateTable
CREATE TABLE "ejercicios" (
    "id_ejercicio" SERIAL NOT NULL,
    "titulo" VARCHAR(180) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "dificultad" "DificultadEjercicio" NOT NULL,
    "categoria" VARCHAR(100) NOT NULL,

    CONSTRAINT "ejercicios_pkey" PRIMARY KEY ("id_ejercicio")
);

-- CreateTable
CREATE TABLE "soluciones" (
    "id_solucion" SERIAL NOT NULL,
    "id_ejercicio" INTEGER NOT NULL,
    "patron_validacion" TEXT NOT NULL,

    CONSTRAINT "soluciones_pkey" PRIMARY KEY ("id_solucion")
);

-- CreateTable
CREATE TABLE "intentos" (
    "id_intento" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_ejercicio" INTEGER NOT NULL,
    "respuesta" TEXT NOT NULL,
    "es_correcto" BOOLEAN NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "intentos_pkey" PRIMARY KEY ("id_intento")
);

-- CreateTable
CREATE TABLE "quizzes" (
    "id_quiz" SERIAL NOT NULL,
    "titulo" VARCHAR(180) NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id_quiz")
);

-- CreateTable
CREATE TABLE "preguntas" (
    "id_pregunta" SERIAL NOT NULL,
    "id_quiz" INTEGER NOT NULL,
    "enunciado" TEXT NOT NULL,

    CONSTRAINT "preguntas_pkey" PRIMARY KEY ("id_pregunta")
);

-- CreateTable
CREATE TABLE "respuestas" (
    "id_respuesta" SERIAL NOT NULL,
    "id_pregunta" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,
    "es_correcta" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "respuestas_pkey" PRIMARY KEY ("id_respuesta")
);

-- CreateTable
CREATE TABLE "progreso_usuario" (
    "id_progreso" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_ejercicio" INTEGER NOT NULL,
    "completado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "progreso_usuario_pkey" PRIMARY KEY ("id_progreso")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "perfiles_id_usuario_key" ON "perfiles"("id_usuario");

-- CreateIndex
CREATE INDEX "perfiles_id_usuario_idx" ON "perfiles"("id_usuario");

-- CreateIndex
CREATE INDEX "ejercicios_categoria_idx" ON "ejercicios"("categoria");

-- CreateIndex
CREATE INDEX "ejercicios_dificultad_idx" ON "ejercicios"("dificultad");

-- CreateIndex
CREATE UNIQUE INDEX "soluciones_id_ejercicio_key" ON "soluciones"("id_ejercicio");

-- CreateIndex
CREATE INDEX "soluciones_id_ejercicio_idx" ON "soluciones"("id_ejercicio");

-- CreateIndex
CREATE INDEX "intentos_id_usuario_idx" ON "intentos"("id_usuario");

-- CreateIndex
CREATE INDEX "intentos_id_ejercicio_idx" ON "intentos"("id_ejercicio");

-- CreateIndex
CREATE INDEX "intentos_fecha_idx" ON "intentos"("fecha");

-- CreateIndex
CREATE INDEX "preguntas_id_quiz_idx" ON "preguntas"("id_quiz");

-- CreateIndex
CREATE INDEX "respuestas_id_pregunta_idx" ON "respuestas"("id_pregunta");

-- CreateIndex
CREATE INDEX "progreso_usuario_id_usuario_idx" ON "progreso_usuario"("id_usuario");

-- CreateIndex
CREATE INDEX "progreso_usuario_id_ejercicio_idx" ON "progreso_usuario"("id_ejercicio");

-- CreateIndex
CREATE UNIQUE INDEX "progreso_usuario_id_usuario_id_ejercicio_key" ON "progreso_usuario"("id_usuario", "id_ejercicio");

-- AddForeignKey
ALTER TABLE "perfiles" ADD CONSTRAINT "perfiles_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "soluciones" ADD CONSTRAINT "soluciones_id_ejercicio_fkey" FOREIGN KEY ("id_ejercicio") REFERENCES "ejercicios"("id_ejercicio") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intentos" ADD CONSTRAINT "intentos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intentos" ADD CONSTRAINT "intentos_id_ejercicio_fkey" FOREIGN KEY ("id_ejercicio") REFERENCES "ejercicios"("id_ejercicio") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preguntas" ADD CONSTRAINT "preguntas_id_quiz_fkey" FOREIGN KEY ("id_quiz") REFERENCES "quizzes"("id_quiz") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respuestas" ADD CONSTRAINT "respuestas_id_pregunta_fkey" FOREIGN KEY ("id_pregunta") REFERENCES "preguntas"("id_pregunta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progreso_usuario" ADD CONSTRAINT "progreso_usuario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progreso_usuario" ADD CONSTRAINT "progreso_usuario_id_ejercicio_fkey" FOREIGN KEY ("id_ejercicio") REFERENCES "ejercicios"("id_ejercicio") ON DELETE CASCADE ON UPDATE CASCADE;
