import { Reparacion } from "../../domain/entities/reparacion";
import { ReparacionRepository } from "../../domain/repositories/reparacionRepository";
import { prisma } from './prisma';

export class PrismaReparacionRepository implements ReparacionRepository {
  async getAll(): Promise<Reparacion[]> {
    const reparaciones = await prisma.reparacion.findMany();
    return reparaciones.map(r =>
      new Reparacion(
        r.id,
        r.descripcion,
        r.fecha_entrada,
        r.fecha_salida,
        r.estado,
        r.costo_mano_obra,
        r.vehiculo_id,
        r.mecanico_id,
        r.recepcionista_id
      )
    );
  }

  async getById(id: number): Promise<Reparacion | null> {
    const r = await prisma.reparacion.findUnique({ where: { id } });
    return r
      ? new Reparacion(
          r.id,
          r.descripcion,
          r.fecha_entrada,
          r.fecha_salida,
          r.estado,
          r.costo_mano_obra,
          r.vehiculo_id,
          r.mecanico_id,
          r.recepcionista_id
        )
      : null;
  }

  async create(data: Omit<Reparacion, "id">): Promise<Reparacion> {
    const r = await prisma.reparacion.create({ data });
    return new Reparacion(
      r.id,
      r.descripcion,
      r.fecha_entrada,
      r.fecha_salida,
      r.estado,
      r.costo_mano_obra,
      r.vehiculo_id,
      r.mecanico_id,
      r.recepcionista_id
    );
  }

  async update(id: number, data: Partial<Omit<Reparacion, "id">>): Promise<Reparacion | null> {
    const r = await prisma.reparacion.update({ where: { id }, data });
    return new Reparacion(
      r.id,
      r.descripcion,
      r.fecha_entrada,
      r.fecha_salida,
      r.estado,
      r.costo_mano_obra,
      r.vehiculo_id,
      r.mecanico_id,
      r.recepcionista_id
    );
  }

  async delete(id: number): Promise<void> {
    await prisma.reparacion.delete({ where: { id } });
  }
}
