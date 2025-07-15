import { VehiculoRepository } from "../../domain/repositories/vehiculoRepository";
import { Vehiculo } from "../../domain/entities/vehiculo";
import prisma from "./prisma";

export class PrismaVehiculoRepository implements VehiculoRepository {
  private mapToEntity(v: any): Vehiculo {
    return new Vehiculo(
      v.id,
      v.marca,
      v.modelo,
      v.anio ?? undefined,
      v.patente,
      v.kilometraje ?? undefined,
      v.cliente_id
    );
  }

  async getAll(): Promise<Vehiculo[]> {
    const vehiculos = await prisma.vehiculos.findMany();
    return vehiculos.map(this.mapToEntity);
  }

  async getById(id: number): Promise<Vehiculo | null> {
    const v = await prisma.vehiculos.findUnique({ where: { id } });
    if (!v) return null;
    return this.mapToEntity(v);
  }

  async create(data: Omit<Vehiculo, "id">): Promise<Vehiculo> {
    const created = await prisma.vehiculos.create({
      data: {
        marca: data.marca,
        modelo: data.modelo,
        anio: data.anio,
        patente: data.patente,
        kilometraje: data.kilometraje,
        cliente_id: data.clienteId,  // camelCase -> snake_case
      },
    });
    return this.mapToEntity(created);
  }

  async getByCliente(clienteId: number): Promise<Vehiculo[]> {
    const vehiculos = await prisma.vehiculos.findMany({ where: { cliente_id: clienteId } });
    return vehiculos.map(this.mapToEntity);
  }
}
