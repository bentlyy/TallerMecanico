import { PrismaClient } from '@prisma/client';
import { UbicacionRepository } from '../../domain/repositories/ubicacionRepository';
import {
  Ubicacion,
  CreateUbicacion,
  UpdateUbicacion,
  MovimientoUbicacion,
  CreateMovimientoUbicacion,
} from '../../domain/entities/ubicacion';

function mapUbicacion(u: any): Ubicacion {
  return new Ubicacion(u.id, u.nombre, u.tipo, u.orden, u.activo, u.empresaId);
}

function mapMovimiento(m: any): MovimientoUbicacion {
  return new MovimientoUbicacion(m.id, m.reparacionId, m.ubicacionId, m.ubicacionNombre, m.usuarioId, m.nota, m.fecha);
}

export class PrismaUbicacionRepository implements UbicacionRepository {
  constructor(private prisma: PrismaClient) {}

  async getAll(empresaId: number, includeInactive = false): Promise<Ubicacion[]> {
    const where: any = { empresaId };
    if (!includeInactive) where.activo = true;
    const ubicaciones = await this.prisma.ubicacion.findMany({
      where,
      orderBy: [{ orden: 'asc' }, { id: 'asc' }],
    });
    return ubicaciones.map(mapUbicacion);
  }

  async getById(id: number): Promise<Ubicacion | null> {
    const u = await this.prisma.ubicacion.findUnique({ where: { id } });
    return u ? mapUbicacion(u) : null;
  }

  async getByNombre(nombre: string, empresaId: number): Promise<Ubicacion | null> {
    const u = await this.prisma.ubicacion.findUnique({
      where: { nombre_empresaId: { nombre, empresaId } },
    });
    return u ? mapUbicacion(u) : null;
  }

  async countReparacionesActivas(id: number): Promise<number> {
    return this.prisma.reparacion.count({
      where: { ubicacionId: id, estado: { not: 'ENTREGADO' } },
    });
  }

  async create(data: CreateUbicacion): Promise<Ubicacion> {
    const u = await this.prisma.ubicacion.create({ data });
    return mapUbicacion(u);
  }

  async update(id: number, data: UpdateUbicacion): Promise<Ubicacion | null> {
    const u = await this.prisma.ubicacion.update({ where: { id }, data });
    return mapUbicacion(u);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.ubicacion.delete({ where: { id } });
  }

  async getMovimientos(reparacionId: number): Promise<MovimientoUbicacion[]> {
    const movs = await this.prisma.movimientoUbicacion.findMany({
      where: { reparacionId },
      orderBy: { fecha: 'desc' },
    });
    return movs.map(mapMovimiento);
  }

  async createMovimiento(data: CreateMovimientoUbicacion): Promise<MovimientoUbicacion> {
    const m = await this.prisma.movimientoUbicacion.create({ data });
    return mapMovimiento(m);
  }
}
