#!/bin/bash
set -e

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-taller_user}"
DB_PASSWORD="${DB_PASSWORD:-taller_password}"
DB_NAME="${DB_NAME:-taller_db}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="${BACKUP_DIR}/taller_db_${TIMESTAMP}.sql"

mkdir -p "$BACKUP_DIR"

echo "Iniciando backup de $DB_NAME en $FILENAME ..."
export PGPASSWORD="$DB_PASSWORD"
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" --no-owner --format=c > "$FILENAME"

echo "Backup completado: $(du -h "$FILENAME" | cut -f1)"
echo "Para restaurar: pg_restore -h $DB_HOST -U $DB_USER -d $DB_NAME $FILENAME"
