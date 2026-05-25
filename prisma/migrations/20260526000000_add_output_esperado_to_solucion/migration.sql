-- Add outputEsperado and stdin columns to soluciones table
ALTER TABLE "soluciones"
ADD COLUMN "output_esperado" TEXT,
ADD COLUMN "stdin" TEXT;
