/*
  Warnings:

  - You are about to drop the `clientes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `detalle_reparacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `facturas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mecanicos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `piezas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reparaciones` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuarios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vehiculos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "detalle_reparacion" DROP CONSTRAINT "detalle_reparacion_pieza_id_fkey";

-- DropForeignKey
ALTER TABLE "detalle_reparacion" DROP CONSTRAINT "detalle_reparacion_reparacion_id_fkey";

-- DropForeignKey
ALTER TABLE "facturas" DROP CONSTRAINT "facturas_cliente_id_fkey";

-- DropForeignKey
ALTER TABLE "facturas" DROP CONSTRAINT "facturas_reparacion_id_fkey";

-- DropForeignKey
ALTER TABLE "mecanicos" DROP CONSTRAINT "mecanicos_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "reparaciones" DROP CONSTRAINT "reparaciones_mecanico_id_fkey";

-- DropForeignKey
ALTER TABLE "reparaciones" DROP CONSTRAINT "reparaciones_recepcionista_id_fkey";

-- DropForeignKey
ALTER TABLE "reparaciones" DROP CONSTRAINT "reparaciones_vehiculo_id_fkey";

-- DropForeignKey
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_rol_id_fkey";

-- DropForeignKey
ALTER TABLE "vehiculos" DROP CONSTRAINT "vehiculos_cliente_id_fkey";

-- DropTable
DROP TABLE "clientes";

-- DropTable
DROP TABLE "detalle_reparacion";

-- DropTable
DROP TABLE "facturas";

-- DropTable
DROP TABLE "mecanicos";

-- DropTable
DROP TABLE "piezas";

-- DropTable
DROP TABLE "reparaciones";

-- DropTable
DROP TABLE "roles";

-- DropTable
DROP TABLE "usuarios";

-- DropTable
DROP TABLE "vehiculos";

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT,
    "telefono" TEXT,
    "direccion" TEXT,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehiculo" (
    "id" SERIAL NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "anio" INTEGER,
    "patente" TEXT NOT NULL,
    "kilometraje" INTEGER,
    "cliente_id" INTEGER NOT NULL,

    CONSTRAINT "Vehiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reparacion" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_entrada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_salida" TIMESTAMP(3),
    "estado" TEXT NOT NULL DEFAULT 'en_revision',
    "costo_mano_obra" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "vehiculo_id" INTEGER NOT NULL,
    "mecanico_id" INTEGER,
    "recepcionista_id" INTEGER NOT NULL,

    CONSTRAINT "Reparacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalleReparacion" (
    "reparacion_id" INTEGER NOT NULL,
    "pieza_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "precio_unitario" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DetalleReparacion_pkey" PRIMARY KEY ("reparacion_id","pieza_id")
);

-- CreateTable
CREATE TABLE "Pieza" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "marca" TEXT,
    "precio" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "codigo" TEXT NOT NULL,

    CONSTRAINT "Pieza_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Factura" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DOUBLE PRECISION NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "reparacion_id" INTEGER NOT NULL,

    CONSTRAINT "Factura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "rol_id" INTEGER NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rol" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "permisos" JSONB NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mecanico" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "especialidad" TEXT,

    CONSTRAINT "Mecanico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "Cliente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehiculo_patente_key" ON "Vehiculo"("patente");

-- CreateIndex
CREATE UNIQUE INDEX "Pieza_codigo_key" ON "Pieza"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Mecanico_usuario_id_key" ON "Mecanico"("usuario_id");

-- AddForeignKey
ALTER TABLE "Vehiculo" ADD CONSTRAINT "Vehiculo_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reparacion" ADD CONSTRAINT "Reparacion_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "Vehiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reparacion" ADD CONSTRAINT "Reparacion_mecanico_id_fkey" FOREIGN KEY ("mecanico_id") REFERENCES "Mecanico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reparacion" ADD CONSTRAINT "Reparacion_recepcionista_id_fkey" FOREIGN KEY ("recepcionista_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleReparacion" ADD CONSTRAINT "DetalleReparacion_reparacion_id_fkey" FOREIGN KEY ("reparacion_id") REFERENCES "Reparacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleReparacion" ADD CONSTRAINT "DetalleReparacion_pieza_id_fkey" FOREIGN KEY ("pieza_id") REFERENCES "Pieza"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_reparacion_id_fkey" FOREIGN KEY ("reparacion_id") REFERENCES "Reparacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mecanico" ADD CONSTRAINT "Mecanico_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
