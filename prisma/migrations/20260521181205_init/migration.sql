-- CreateEnum
CREATE TYPE "public"."EstadoReparacion" AS ENUM ('EN_REVISION', 'EN_REPARACION', 'TERMINADO', 'ENTREGADO');

-- CreateTable
CREATE TABLE "public"."empresas" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."clientes" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT,
    "telefono" TEXT,
    "direccion" TEXT,
    "empresa_id" INTEGER NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vehiculos" (
    "id" SERIAL NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "anio" INTEGER,
    "patente" TEXT NOT NULL,
    "kilometraje" INTEGER,
    "cliente_id" INTEGER NOT NULL,

    CONSTRAINT "vehiculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reparaciones" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_entrada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_salida" TIMESTAMP(3),
    "estado" "public"."EstadoReparacion" NOT NULL DEFAULT 'EN_REVISION',
    "costo_mano_obra" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "vehiculo_id" INTEGER NOT NULL,
    "mecanico_id" INTEGER,
    "recepcionista_id" INTEGER NOT NULL,

    CONSTRAINT "reparaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."detalle_reparacion" (
    "id" SERIAL NOT NULL,
    "reparacion_id" INTEGER NOT NULL,
    "pieza_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "precio_unitario" DOUBLE PRECISION NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "detalle_reparacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."piezas" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "marca" TEXT,
    "precio" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "codigo" TEXT NOT NULL,
    "empresa_id" INTEGER NOT NULL,

    CONSTRAINT "piezas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."facturas" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DOUBLE PRECISION NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "reparacion_id" INTEGER NOT NULL,

    CONSTRAINT "facturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."usuarios" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "rol_id" INTEGER NOT NULL,
    "empresa_id" INTEGER NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."roles" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "permisos" JSONB NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."mecanicos" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "especialidad" TEXT,

    CONSTRAINT "mecanicos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_email_empresa_id_key" ON "public"."clientes"("email", "empresa_id");

-- CreateIndex
CREATE UNIQUE INDEX "vehiculos_patente_cliente_id_key" ON "public"."vehiculos"("patente", "cliente_id");

-- CreateIndex
CREATE UNIQUE INDEX "detalle_reparacion_reparacion_id_pieza_id_key" ON "public"."detalle_reparacion"("reparacion_id", "pieza_id");

-- CreateIndex
CREATE UNIQUE INDEX "piezas_codigo_empresa_id_key" ON "public"."piezas"("codigo", "empresa_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_empresa_id_key" ON "public"."usuarios"("email", "empresa_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_nombre_key" ON "public"."roles"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "mecanicos_usuario_id_key" ON "public"."mecanicos"("usuario_id");

-- AddForeignKey
ALTER TABLE "public"."clientes" ADD CONSTRAINT "clientes_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vehiculos" ADD CONSTRAINT "vehiculos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reparaciones" ADD CONSTRAINT "reparaciones_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "public"."vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reparaciones" ADD CONSTRAINT "reparaciones_mecanico_id_fkey" FOREIGN KEY ("mecanico_id") REFERENCES "public"."mecanicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reparaciones" ADD CONSTRAINT "reparaciones_recepcionista_id_fkey" FOREIGN KEY ("recepcionista_id") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."detalle_reparacion" ADD CONSTRAINT "detalle_reparacion_reparacion_id_fkey" FOREIGN KEY ("reparacion_id") REFERENCES "public"."reparaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."detalle_reparacion" ADD CONSTRAINT "detalle_reparacion_pieza_id_fkey" FOREIGN KEY ("pieza_id") REFERENCES "public"."piezas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."piezas" ADD CONSTRAINT "piezas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."facturas" ADD CONSTRAINT "facturas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."facturas" ADD CONSTRAINT "facturas_reparacion_id_fkey" FOREIGN KEY ("reparacion_id") REFERENCES "public"."reparaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usuarios" ADD CONSTRAINT "usuarios_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "public"."roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usuarios" ADD CONSTRAINT "usuarios_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."mecanicos" ADD CONSTRAINT "mecanicos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
