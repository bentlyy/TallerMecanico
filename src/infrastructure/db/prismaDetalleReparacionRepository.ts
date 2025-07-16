import { DetalleReparacion } from "../../domain/entities/detalleReparacion";
import { DetalleReparacionRepository } from "../../domain/repositories/detalleReparacionRepository";
import { prisma } from './prisma'; // ✅ Correcto


export class PrismaDetalleReparacionRepository implements DetalleReparacionRepository {
  async getByReparacionId(reparacionId: number): Promise<DetalleReparacion[]> {
    const detalles = await prisma.detalleReparacion.findMany({
      where: { reparacion_id: reparacionId },
    });
    return detalles.map(d => new DetalleReparacion(d.reparacion_id, d.pieza_id, d.cantidad, d.precio_unitario));
  }

  async addDetalle(detalle: DetalleReparacion): Promise<DetalleReparacion> {
    const d = await prisma.detalleReparacion.create({
      data: {
        reparacion_id: detalle.reparacionId,
        pieza_id: detalle.piezaId,
        cantidad: detalle.cantidad,
        precio_unitario: detalle.precioUnitario,
      },
    });
    return new DetalleReparacion(d.reparacion_id, d.pieza_id, d.cantidad, d.precio_unitario);
  }

  async updateDetalle(reparacionId: number, piezaId: number, data: Partial<Omit<DetalleReparacion, "reparacionId" | "piezaId">>): Promise<DetalleReparacion | null> {
    const d = await prisma.detalleReparacion.update({
      where: { reparacion_id_pieza_id: { reparacion_id: reparacionId, pieza_id: piezaId } },
      data,
    });
    return new DetalleReparacion(d.reparacion_id, d.pieza_id, d.cantidad, d.precio_unitario);
  }

  async deleteDetalle(reparacionId: number, piezaId: number): Promise<void> {
    await prisma.detalleReparacion.delete({
      where: { reparacion_id_pieza_id: { reparacion_id: reparacionId, pieza_id: piezaId } },
    });
  }
}
