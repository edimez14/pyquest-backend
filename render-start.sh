#!/usr/bin/env bash
set -e

echo "========================================"
echo "  PyQuest Backend — Render Deploy"
echo "  Node: $(node -v)"
echo "  NPM: $(npm -v)"
echo "========================================"

# Wait for PostgreSQL to be ready (Render provides DATABASE_URL)
echo "[1/2] Running Prisma migrations..."
npx prisma migrate deploy || echo "⚠️  Migrations skipped (DB may not be ready)"

echo "[2/2] Starting server on port ${PORT:-10000}..."
exec node dist/src/main

