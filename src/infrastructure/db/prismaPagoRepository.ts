import { PrismaClient } from '@prisma/client';
import { PagoRepository } from '../../domain/repositories/pagoRepository';
import { Pago, CreatePago } from '../../domain/entities/pago';

function mapPago(p: any): Pago {
  return new Pago(p.id, p.facturaId, p.fecha, p.monto, p.metodo, p.nota ?? null);
}

export class PrismaPagoRepository implements PagoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getByFactura(facturaId: number): Promise<Pago[]> {
    const pagos = await this.prisma.pago.findMany({ where: { facturaId }, orderBy: { fecha: 'asc' } });
    return pagos.map(mapPago);
  }

  async getById(id: number): Promise<Pago | null> {
    const pago = await this.prisma.pago.findUnique({ where: { id } });
    return pago ? mapPago(pago) : null;
  }

  async create(data: CreatePago): Promise<Pago> {
    const pago = await this.prisma.pago.create({
      data: {
        facturaId: data.facturaId,
        monto: data.monto,
        metodo: data.metodo,
        nota: data.nota ?? null,
        fecha: data.fecha ?? new Date(),
      },
    });
    return mapPago(pago);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.pago.delete({ where: { id } });
  }

  async sumByFactura(facturaId: number): Promise<number> {
    const agg = await this.prisma.pago.aggregate({ where: { facturaId }, _sum: { monto: true } });
    return agg._sum.monto ?? 0;
  }
}
