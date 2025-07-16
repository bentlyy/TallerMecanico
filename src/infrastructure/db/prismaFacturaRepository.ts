import { Factura } from "../../domain/entities/factura";
import { FacturaRepository } from "../../domain/repositories/facturaRepository";
import { prisma } from './prisma'; // ✅ Correcto

export class PrismaFacturaRepository implements FacturaRepository {
  async getAll(): Promise<Factura[]> {
    const facturas = await prisma.factura.findMany();
    return facturas.map(f =>
      new Factura(f.id, f.fecha, f.total, f.cliente_id, f.reparacion_id)
    );
  }

  async getById(id: number): Promise<Factura | null> {
    const f = await prisma.factura.findUnique({ where: { id } });
    return f ? new Factura(f.id, f.fecha, f.total, f.cliente_id, f.reparacion_id) : null;
  }

  async create(data: Omit<Factura, "id" | "fecha">): Promise<Factura> {
    const f = await prisma.factura.create({
      data: {
        total: data.total,
        cliente_id: data.clienteId,
        reparacion_id: data.reparacionId,
      },
    });
    return new Factura(f.id, f.fecha, f.total, f.cliente_id, f.reparacion_id);
  }
}
