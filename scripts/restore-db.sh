#!/bin/bash
set -e

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-taller_user}"
DB_PASSWORD="${DB_PASSWORD:-taller_password}"
DB_NAME="${DB_NAME:-taller_db}"

if [ -z "$1" ]; then
  echo "Uso: $0 <archivo_backup.sql>"
  exit 1
fi

BACKUP_FILE="$1"
if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: Archivo $BACKUP_FILE no encontrado"
  exit 1
fi

echo "Restaurando $DB_NAME desde $BACKUP_FILE ..."
export PGPASSWORD="$DB_PASSWORD"
pg_restore -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" --clean --if-exists "$BACKUP_FILE"

echo "Restauración completada exitosamente"
