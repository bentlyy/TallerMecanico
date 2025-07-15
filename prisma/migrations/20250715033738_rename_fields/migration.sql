/*
  Warnings:

  - You are about to drop the column `año` on the `vehiculos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "vehiculos" DROP COLUMN "año",
ADD COLUMN     "anio" INTEGER;
