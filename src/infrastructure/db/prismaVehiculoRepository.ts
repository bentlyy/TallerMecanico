//prismaVehiculoRepository.ts
import { PrismaClient } from '@prisma/client';
import { VehiculoRepository } from '../../domain/repositories/vehiculoRepository';
import { Vehiculo, CreateVehiculo, UpdateVehiculo } from '../../domain/entities/vehiculo';
import { Reparacion } from '../../domain/entities/reparacion';

export class PrismaVehiculoRepository implements VehiculoRepository {
  constructor(private prisma: PrismaClient) {}

  async getAll(): Promise<Vehiculo[]> {
    const vehiculos = await this.prisma.vehiculo.findMany();
    return vehiculos.map(v => new Vehiculo(
      v.id,
      v.marca,
      v.modelo,
      v.anio,
      v.patente,
      v.kilometraje,
      v.clienteId
    ));
  }

  async getById(id: number): Promise<Vehiculo | null> {
    const vehiculo = await this.prisma.vehiculo.findUnique({ where: { id } });
    return vehiculo ? new Vehiculo(
      vehiculo.id,
      vehiculo.marca,
      vehiculo.modelo,
      vehiculo.anio,
      vehiculo.patente,
      vehiculo.kilometraje,
      vehiculo.clienteId
    ) : null;
  }

  async create(data: CreateVehiculo): Promise<Vehiculo> {
    const vehiculo = await this.prisma.vehiculo.create({ data });
    return new Vehiculo(
      vehiculo.id,
      vehiculo.marca,
      vehiculo.modelo,
      vehiculo.anio,
      vehiculo.patente,
      vehiculo.kilometraje,
      vehiculo.clienteId
    );
  }

  async update(id: number, data: UpdateVehiculo): Promise<Vehiculo | null> {
    const vehiculo = await this.prisma.vehiculo.update({
      where: { id },
      data
    });
    return vehiculo ? new Vehiculo(
      vehiculo.id,
      vehiculo.marca,
      vehiculo.modelo,
      vehiculo.anio,
      vehiculo.patente,
      vehiculo.kilometraje,
      vehiculo.clienteId
    ) : null;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.vehiculo.delete({ where: { id } });
  }

  async getByCliente(clienteId: number): Promise<Vehiculo[]> {
    const vehiculos = await this.prisma.vehiculo.findMany({ 
      where: { clienteId } 
    });
    return vehiculos.map(v => new Vehiculo(
      v.id,
      v.marca,
      v.modelo,
      v.anio,
      v.patente,
      v.kilometraje,
      v.clienteId
    ));
  }

  async getReparaciones(vehiculoId: number): Promise<Reparacion[]> {
    const reparaciones = await this.prisma.reparacion.findMany({
      where: { vehiculoId },
      include: {
        vehiculo: true,
        mecanico: { include: { usuario: true } },
        recepcionista: true
      }
    });

    return reparaciones.map(r => new Reparacion(
      r.id,
      r.descripcion,
      r.fechaEntrada,
      r.fechaSalida,
      r.estado,
      r.costoManoObra,
      r.vehiculoId,
      r.mecanicoId,
      r.recepcionistaId
    ));
  }
}