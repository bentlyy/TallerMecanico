import { PrismaClient } from '@prisma/client';
import { VehiculoRepository } from '../../domain/repositories/vehiculoRepository';
import { Vehiculo, CreateVehiculo, UpdateVehiculo } from '../../domain/entities/vehiculo';
import { Reparacion } from '../../domain/entities/reparacion';

function mapVehiculo(v: any): Vehiculo {
  return new Vehiculo(v.id, v.marca, v.modelo, v.anio, v.patente, v.kilometraje, v.clienteId);
}

export class PrismaVehiculoRepository implements VehiculoRepository {
  constructor(private prisma: PrismaClient) {}

  async getAll(skip?: number, limit?: number): Promise<Vehiculo[]> {
    const vehiculos = await this.prisma.vehiculo.findMany({ skip, take: limit });
    return vehiculos.map(mapVehiculo);
  }

  async count(): Promise<number> {
    return this.prisma.vehiculo.count();
  }

  async getById(id: number): Promise<Vehiculo | null> {
    const vehiculo = await this.prisma.vehiculo.findUnique({ where: { id } });
    return vehiculo ? mapVehiculo(vehiculo) : null;
  }

  async create(data: CreateVehiculo): Promise<Vehiculo> {
    const vehiculo = await this.prisma.vehiculo.create({ data });
    return mapVehiculo(vehiculo);
  }

  async update(id: number, data: UpdateVehiculo): Promise<Vehiculo | null> {
    const vehiculo = await this.prisma.vehiculo.update({ where: { id }, data });
    return vehiculo ? mapVehiculo(vehiculo) : null;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.vehiculo.delete({ where: { id } });
  }

  async getByCliente(clienteId: number): Promise<Vehiculo[]> {
    const vehiculos = await this.prisma.vehiculo.findMany({ where: { clienteId } });
    return vehiculos.map(mapVehiculo);
  }

  async getReparaciones(vehiculoId: number): Promise<Reparacion[]> {
    const reparaciones = await this.prisma.reparacion.findMany({
      where: { vehiculoId },
      include: {
        vehiculo: true,
        mecanico: { include: { usuario: true } },
        recepcionista: true,
      },
    });
    return reparaciones.map(
      (r) =>
        new Reparacion(
          r.id,
          r.descripcion,
          r.fechaEntrada,
          r.fechaSalida,
          r.estado,
          r.costoManoObra,
          r.vehiculoId,
          r.mecanicoId,
          r.recepcionistaId,
        ),
    );
  }
}
