#!/bin/sh
set -e

DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-5432}"
MAX_RETRIES="${DB_RETRIES:-30}"
RETRY_INTERVAL="${DB_RETRY_INTERVAL:-2}"

echo "Esperando a que la base de datos esté lista en ${DB_HOST}:${DB_PORT}..."
i=1
while [ $i -le $MAX_RETRIES ]; do
  if nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; then
    echo "Base de datos disponible!"
    break
  fi
  echo "Intento $i/$MAX_RETRIES - Base de datos no disponible, reintentando en ${RETRY_INTERVAL}s..."
  sleep "$RETRY_INTERVAL"
  i=$((i + 1))
done

if [ $i -gt $MAX_RETRIES ]; then
  echo "Error: No se pudo conectar a la base de datos después de $MAX_RETRIES intentos"
  exit 1
fi

echo "Aplicando migraciones de Prisma..."
npx prisma migrate deploy 2>&1
if [ $? -ne 0 ]; then
  echo "Error: Fallo al aplicar migraciones"
  exit 1
fi

echo "Iniciando el servidor..."
exec "$@"
