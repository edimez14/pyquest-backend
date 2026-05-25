-- Add outputEsperado and stdin columns to soluciones table (idempotent)
ALTER TABLE "soluciones"
ADD COLUMN IF NOT EXISTS "output_esperado" TEXT,
ADD COLUMN IF NOT EXISTS "stdin" TEXT;
