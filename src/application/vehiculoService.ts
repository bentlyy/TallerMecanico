//vehiculoService.ts
import { VehiculoRepository } from '../domain/repositories/vehiculoRepository';
import { Vehiculo, CreateVehiculo, UpdateVehiculo } from '../domain/entities/vehiculo';
import { Reparacion } from '../domain/entities/reparacion';
import { prisma } from '../infrastructure/db/prisma'; // Asegúrate de importar Prisma
import { ClienteRepository } from '../domain/repositories/clienteRepository';

export class VehiculoService {
  constructor( private readonly vehiculoRepository: VehiculoRepository,
    private readonly clienteRepository: ClienteRepository
  ) {}

  async getAllVehiculos(): Promise<Vehiculo[]> {
    return this.vehiculoRepository.getAll();
  }

  async getVehiculoById(id: number): Promise<Vehiculo | null> {
    return this.vehiculoRepository.getById(id);
  }

  async createVehiculo(data: CreateVehiculo): Promise<Vehiculo> {
    const cliente = await this.clienteRepository.getById(data.clienteId);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }
    return this.vehiculoRepository.create(data);
  }

  async updateVehiculo(id: number, data: UpdateVehiculo): Promise<Vehiculo | null> {
    return this.vehiculoRepository.update(id, data);
  }

  async deleteVehiculo(id: number): Promise<void> {
    return this.vehiculoRepository.delete(id);
  }

  async getVehiculosPorCliente(clienteId: number): Promise<Vehiculo[]> {
    return this.vehiculoRepository.getByCliente(clienteId);
  }

  async getReparacionesPorVehiculo(vehiculoId: number): Promise<Reparacion[]> {
    return this.vehiculoRepository.getReparaciones(vehiculoId);
  }
}
