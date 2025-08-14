#!/bin/sh
set -e

echo "Esperando a que la base de datos esté lista..."
until nc -z db 5432; do
  echo "Base de datos no disponible todavía, reintentando en 2s..."
  sleep 2
done

echo "Base de datos lista, aplicando migraciones de Prisma..."
npx prisma migrate deploy

echo "Iniciando el servidor..."
exec npm run start
