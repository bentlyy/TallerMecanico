import { PrismaClient } from '@prisma/client';
import { FacturaRepository } from '../../domain/repositories/facturaRepository';
import { Factura, CreateFactura } from '../../domain/entities/factura';

function mapFactura(f: any): Factura {
  return new Factura(f.id, f.fecha, f.total, f.clienteId, f.reparacionId);
}

export class PrismaFacturaRepository implements FacturaRepository {
  constructor(private prisma: PrismaClient) {}

  async getAll(skip?: number, limit?: number): Promise<Factura[]> {
    const facturas = await this.prisma.factura.findMany({ skip, take: limit });
    return facturas.map(mapFactura);
  }

  async count(): Promise<number> {
    return this.prisma.factura.count();
  }

  async getById(id: number): Promise<Factura | null> {
    const factura = await this.prisma.factura.findUnique({ where: { id } });
    return factura ? mapFactura(factura) : null;
  }

  async create(data: CreateFactura): Promise<Factura> {
    const reparacion = await this.prisma.reparacion.findUnique({
      where: { id: data.reparacionId },
      include: { detalleReparacion: true },
    });
    if (!reparacion) throw new Error(`Reparación id=${data.reparacionId} no encontrada`);

    const totalRepuestos = reparacion.detalleReparacion.reduce((sum, d) => sum + d.cantidad * d.precioUnitario, 0);
    const total = reparacion.costoManoObra + totalRepuestos;

    const factura = await this.prisma.factura.create({
      data: { fecha: new Date(), total, clienteId: data.clienteId, reparacionId: data.reparacionId },
    });
    return mapFactura(factura);
  }

  async getByCliente(clienteId: number): Promise<Factura[]> {
    const facturas = await this.prisma.factura.findMany({ where: { clienteId } });
    return facturas.map(mapFactura);
  }

  async getByReparacion(reparacionId: number): Promise<Factura | null> {
    const factura = await this.prisma.factura.findFirst({ where: { reparacionId } });
    return factura ? mapFactura(factura) : null;
  }
}
