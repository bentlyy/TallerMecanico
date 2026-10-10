import { PrismaClient } from '@prisma/client';
import { FacturaRepository } from '../../domain/repositories/facturaRepository';
import { Factura, CreateFactura } from '../../domain/entities/factura';
import { Pago } from '../../domain/entities/pago';

function mapPago(p: any): Pago {
  return new Pago(p.id, p.facturaId, p.fecha, p.monto, p.metodo, p.nota ?? null);
}

function mapFactura(f: any): Factura {
  return new Factura(f.id, f.fecha, f.total, f.clienteId, f.reparacionId, (f.pagos ?? []).map(mapPago));
}

export class PrismaFacturaRepository implements FacturaRepository {
  constructor(private prisma: PrismaClient) {}

  async getAll(skip?: number, limit?: number): Promise<Factura[]> {
    const facturas = await this.prisma.factura.findMany({ skip, take: limit, include: { pagos: true } });
    return facturas.map(mapFactura);
  }

  async count(): Promise<number> {
    return this.prisma.factura.count();
  }

  async getById(id: number): Promise<Factura | null> {
    const factura = await this.prisma.factura.findUnique({ where: { id }, include: { pagos: true } });
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

  async delete(id: number): Promise<void> {
    await this.prisma.factura.delete({ where: { id } });
  }

  async getByCliente(clienteId: number): Promise<Factura[]> {
    const facturas = await this.prisma.factura.findMany({ where: { clienteId }, include: { pagos: true } });
    return facturas.map(mapFactura);
  }

  async getByReparacion(reparacionId: number): Promise<Factura | null> {
    const factura = await this.prisma.factura.findFirst({ where: { reparacionId }, include: { pagos: true } });
    return factura ? mapFactura(factura) : null;
  }
}
