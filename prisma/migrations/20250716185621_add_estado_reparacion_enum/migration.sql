/*
  Warnings:

  - The `estado` column on the `Reparacion` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EstadoReparacion" AS ENUM ('EN_REVISION', 'EN_REPARACION', 'TERMINADO', 'ENTREGADO');

-- AlterTable
ALTER TABLE "Reparacion" DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoReparacion" NOT NULL DEFAULT 'EN_REVISION';
