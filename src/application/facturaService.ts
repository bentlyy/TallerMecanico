import { Factura } from "../domain/entities/factura";
import { FacturaRepository } from "../domain/repositories/facturaRepository";
import prisma from "../infrastructure/db/prisma";

export class FacturaService {
  constructor(private facturaRepository: FacturaRepository) {}

  async listar(): Promise<Factura[]> {
    return this.facturaRepository.getAll();
  }

  async obtenerPorId(id: number): Promise<Factura | null> {
    return this.facturaRepository.getById(id);
  }

  async generarFactura(reparacionId: number): Promise<Factura> {
    const reparacion = await prisma.reparacion.findUnique({
      where: { id: reparacionId },
      include: {
        detalleReparacion: true,
        cliente: true,
      },
    });

    if (!reparacion) throw new Error("Reparación no encontrada");

    // Calcular el total
    const piezasTotal = reparacion.detalleReparacion.reduce(
      (sum, d) => sum + d.precio_unitario * d.cantidad,
      0
    );

    const total = piezasTotal + reparacion.costo_mano_obra;

    return this.facturaRepository.create({
      total,
      clienteId: reparacion.cliente_id,
      reparacionId,
    });
  }
}
