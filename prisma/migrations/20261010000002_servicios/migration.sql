-- CreateTable
CREATE TABLE "servicios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "problema_reportado" TEXT,
    "diagnostico" TEXT,
    "trabajos_realizados" TEXT,
    "precio_base" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "empresa_id" INTEGER NOT NULL,

    CONSTRAINT "servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reparacion_servicio" (
    "id" SERIAL NOT NULL,
    "reparacion_id" INTEGER NOT NULL,
    "servicio_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "precio_unitario" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "reparacion_servicio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reparacion_servicio_reparacion_id_servicio_id_key" ON "reparacion_servicio"("reparacion_id", "servicio_id");

-- AddForeignKey
ALTER TABLE "servicios" ADD CONSTRAINT "servicios_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reparacion_servicio" ADD CONSTRAINT "reparacion_servicio_reparacion_id_fkey" FOREIGN KEY ("reparacion_id") REFERENCES "reparaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reparacion_servicio" ADD CONSTRAINT "reparacion_servicio_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
