import { VehiculoRepository } from "../../domain/repositories/vehiculoRepository";
import { Vehiculo } from "../../domain/entities/vehiculo";
import { prisma } from './prisma';

export class PrismaVehiculoRepository implements VehiculoRepository {
  async getAll(): Promise<Vehiculo[]> {
    const vehiculos = await prisma.vehiculo.findMany();
    return vehiculos.map(v => new Vehiculo(
      v.id,
      v.marca,
      v.modelo,
      v.anio,
      v.patente,
      v.kilometraje,
      v.cliente_id
    ));
  }

  async getById(id: number): Promise<Vehiculo | null> {
    const v = await prisma.vehiculo.findUnique({ where: { id } });
    return v ? new Vehiculo(
      v.id,
      v.marca,
      v.modelo,
      v.anio,
      v.patente,
      v.kilometraje,
      v.cliente_id
    ) : null;
  }

  async create(data: Omit<Vehiculo, "id">): Promise<Vehiculo> {
    const v = await prisma.vehiculo.create({
      data: {
        marca: data.marca,
        modelo: data.modelo,
        anio: data.anio ?? undefined,
        patente: data.patente,
        kilometraje: data.kilometraje ?? undefined,
        cliente_id: data.cliente_id,
      }
    });
    return new Vehiculo(
      v.id,
      v.marca,
      v.modelo,
      v.anio,
      v.patente,
      v.kilometraje,
      v.cliente_id
    );
  }

  async update(id: number, data: Partial<Omit<Vehiculo, "id">>): Promise<Vehiculo | null> {
    const v = await prisma.vehiculo.update({
      where: { id },
      data: {
        marca: data.marca,
        modelo: data.modelo,
        anio: data.anio ?? undefined,
        patente: data.patente,
        kilometraje: data.kilometraje ?? undefined,
        cliente_id: data.cliente_id
      }
    });
    return new Vehiculo(
      v.id,
      v.marca,
      v.modelo,
      v.anio,
      v.patente,
      v.kilometraje,
      v.cliente_id
    );
  }

  async delete(id: number): Promise<void> {
    await prisma.vehiculo.delete({ where: { id } });
  }
}
