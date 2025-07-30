/*
  Warnings:

  - The primary key for the `DetalleReparacion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[reparacion_id,pieza_id]` on the table `DetalleReparacion` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "DetalleReparacion" DROP CONSTRAINT "DetalleReparacion_pkey",
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "DetalleReparacion_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "DetalleReparacion_reparacion_id_pieza_id_key" ON "DetalleReparacion"("reparacion_id", "pieza_id");
