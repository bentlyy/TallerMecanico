-- AlterTable: campos estructurados del detalle de reparación
ALTER TABLE "reparaciones"
ADD COLUMN "problema_reportado" TEXT,
ADD COLUMN "diagnostico" TEXT,
ADD COLUMN "trabajos_realizados" TEXT;
