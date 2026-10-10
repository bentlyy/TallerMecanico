import { PrismaClient } from '@prisma/client';
import { ServicioRepository } from '../../domain/repositories/servicioRepository';
import { Servicio, CreateServicio, UpdateServicio } from '../../domain/entities/servicio';

function mapServicio(s: any): Servicio {
  return new Servicio(
    s.id,
    s.nombre,
    s.descripcion ?? null,
    s.problemaReportado ?? null,
    s.diagnostico ?? null,
    s.trabajosRealizados ?? null,
    s.precioBase,
    s.activo,
    s.empresaId,
  );
}

export class PrismaServicioRepository implements ServicioRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getAll(empresaId: number, skip?: number, limit?: number): Promise<Servicio[]> {
    const servicios = await this.prisma.servicio.findMany({
      where: { empresaId },
      orderBy: { nombre: 'asc' },
      skip,
      take: limit,
    });
    return servicios.map(mapServicio);
  }

  async count(empresaId: number): Promise<number> {
    return this.prisma.servicio.count({ where: { empresaId } });
  }

  async getById(id: number): Promise<Servicio | null> {
    const servicio = await this.prisma.servicio.findUnique({ where: { id } });
    return servicio ? mapServicio(servicio) : null;
  }

  async getByNombre(nombre: string, empresaId: number): Promise<Servicio | null> {
    const servicio = await this.prisma.servicio.findFirst({ where: { nombre, empresaId } });
    return servicio ? mapServicio(servicio) : null;
  }

  async create(data: CreateServicio): Promise<Servicio> {
    const servicio = await this.prisma.servicio.create({ data });
    return mapServicio(servicio);
  }

  async update(id: number, data: UpdateServicio): Promise<Servicio | null> {
    const servicio = await this.prisma.servicio.update({ where: { id }, data });
    return mapServicio(servicio);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.servicio.delete({ where: { id } });
  }
}
