-- CreateEnum
CREATE TYPE "TipoUbicacion" AS ENUM ('RECEPCION', 'ESTACIONAMIENTO', 'BAHIA', 'ELEVADOR', 'FOSO', 'DIAGNOSTICO', 'ALINEACION', 'NEUMATICOS', 'LUBRICACION', 'ELECTRICIDAD', 'CHAPA_PINTURA', 'LAVADO', 'TERMINADOS', 'OTRO');

-- CreateEnum
CREATE TYPE "PlanEmpresa" AS ENUM ('NORMAL', 'PREMIUM');

-- AlterTable
ALTER TABLE "empresas" ADD COLUMN "plan" "PlanEmpresa" NOT NULL DEFAULT 'NORMAL';

-- AlterTable
ALTER TABLE "reparaciones" ADD COLUMN "ubicacion_id" INTEGER;

-- CreateTable
CREATE TABLE "ubicaciones" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoUbicacion" NOT NULL DEFAULT 'OTRO',
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "empresa_id" INTEGER NOT NULL,

    CONSTRAINT "ubicaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimiento_ubicacion" (
    "id" SERIAL NOT NULL,
    "reparacion_id" INTEGER NOT NULL,
    "ubicacion_id" INTEGER,
    "ubicacion_nombre" TEXT,
    "usuario_id" INTEGER,
    "nota" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimiento_ubicacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ubicaciones_nombre_empresa_id_key" ON "ubicaciones"("nombre", "empresa_id");

-- AddForeignKey
ALTER TABLE "ubicaciones" ADD CONSTRAINT "ubicaciones_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reparaciones" ADD CONSTRAINT "reparaciones_ubicacion_id_fkey" FOREIGN KEY ("ubicacion_id") REFERENCES "ubicaciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimiento_ubicacion" ADD CONSTRAINT "movimiento_ubicacion_reparacion_id_fkey" FOREIGN KEY ("reparacion_id") REFERENCES "reparaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimiento_ubicacion" ADD CONSTRAINT "movimiento_ubicacion_ubicacion_id_fkey" FOREIGN KEY ("ubicacion_id") REFERENCES "ubicaciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;
