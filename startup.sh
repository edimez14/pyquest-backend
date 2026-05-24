#!/bin/sh
set -e

# Wait for the database to be reachable before running migrations
# This prevents Prisma from hanging indefinitely on connection failures
echo "[startup] Waiting for database connection..."
MAX_RETRIES=10
RETRY_DELAY=3
RETRY_COUNT=0

# Parse host from DATABASE_URL to test connectivity
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:/]*\).*/\1/p')
DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_PORT=${DB_PORT:-5432}

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if node -e "
    const net = require('net');
    const socket = new net.Socket();
    socket.setTimeout(5000);
    socket.connect($DB_PORT, '$DB_HOST', () => { socket.destroy(); process.exit(0); });
    socket.on('error', () => { socket.destroy(); process.exit(1); });
    socket.on('timeout', () => { socket.destroy(); process.exit(1); });
  " 2>/dev/null; then
    echo "[startup] Database is reachable"
    break
  fi
  RETRY_COUNT=$((RETRY_COUNT + 1))
  echo "[startup] Database not ready (attempt $RETRY_COUNT/$MAX_RETRIES), retrying in ${RETRY_DELAY}s..."
  sleep $RETRY_DELAY
done

# Run migrations (fails gracefully — app will start even if migrations fail)
echo "[startup] Running database migrations..."
npx prisma migrate deploy 2>&1 || echo "[startup] WARNING: Migration failed, continuing anyway"

echo "[startup] Starting API server..."
exec node dist/main
