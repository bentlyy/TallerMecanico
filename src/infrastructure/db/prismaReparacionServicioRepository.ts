import { PrismaClient } from '@prisma/client';
import { ReparacionServicioRepository } from '../../domain/repositories/reparacionServicioRepository';
import { ReparacionServicio, CreateReparacionServicio } from '../../domain/entities/reparacionServicio';

function mapReparacionServicio(rs: any): ReparacionServicio {
  return new ReparacionServicio(
    rs.id,
    rs.reparacionId,
    rs.servicioId,
    rs.cantidad,
    rs.precioUnitario,
    rs.servicio ?? undefined,
  );
}

export class PrismaReparacionServicioRepository implements ReparacionServicioRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getByReparacion(reparacionId: number): Promise<ReparacionServicio[]> {
    const rows = await this.prisma.reparacionServicio.findMany({
      where: { reparacionId },
      include: { servicio: true },
      orderBy: { id: 'asc' },
    });
    return rows.map(mapReparacionServicio);
  }

  async getByReparacionAndServicio(reparacionId: number, servicioId: number): Promise<ReparacionServicio | null> {
    const row = await this.prisma.reparacionServicio.findUnique({
      where: { reparacionId_servicioId: { reparacionId, servicioId } },
    });
    return row ? mapReparacionServicio(row) : null;
  }

  async create(data: CreateReparacionServicio): Promise<ReparacionServicio> {
    const row = await this.prisma.reparacionServicio.create({ data, include: { servicio: true } });
    return mapReparacionServicio(row);
  }

  async updateCantidad(id: number, cantidad: number, precioUnitario: number): Promise<ReparacionServicio> {
    const row = await this.prisma.reparacionServicio.update({
      where: { id },
      data: { cantidad, precioUnitario },
      include: { servicio: true },
    });
    return mapReparacionServicio(row);
  }

  async delete(reparacionId: number, servicioId: number): Promise<void> {
    await this.prisma.reparacionServicio.delete({
      where: { reparacionId_servicioId: { reparacionId, servicioId } },
    });
  }

  async sumByReparacion(reparacionId: number): Promise<number> {
    const rows = await this.prisma.reparacionServicio.findMany({ where: { reparacionId } });
    return rows.reduce((sum, r) => sum + r.cantidad * r.precioUnitario, 0);
  }
}
