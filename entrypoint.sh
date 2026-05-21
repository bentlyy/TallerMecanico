#!/bin/sh
set -e

echo "Esperando a que la base de datos esté lista..."
for i in $(seq 1 30); do
  if nc -z db 5432 2>/dev/null; then
    break
  fi
  echo "Base de datos no disponible todavía, reintentando en 2s... ($i/30)"
  sleep 2
done

echo "Base de datos lista, aplicando migraciones de Prisma..."
npx prisma migrate deploy

echo "Iniciando el servidor..."
exec npm run prod
