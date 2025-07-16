import { VehiculoRepository } from '../domain/repositories/vehiculoRepository';
import { Vehiculo, CreateVehiculo, UpdateVehiculo } from '../domain/entities/vehiculo';
import { Reparacion } from '../domain/entities/reparacion';

export class VehiculoService {
  constructor(private readonly repository: VehiculoRepository) {}

  async getAllVehiculos(): Promise<Vehiculo[]> {
    return this.repository.getAll();
  }

  async getVehiculoById(id: number): Promise<Vehiculo | null> {
    return this.repository.getById(id);
  }

  async createVehiculo(data: CreateVehiculo): Promise<Vehiculo> {
    return this.repository.create(data);
  }

  async updateVehiculo(id: number, data: UpdateVehiculo): Promise<Vehiculo | null> {
    return this.repository.update(id, data);
  }

  async deleteVehiculo(id: number): Promise<void> {
    return this.repository.delete(id);
  }

  async getVehiculosPorCliente(clienteId: number): Promise<Vehiculo[]> {
    return this.repository.getByCliente(clienteId);
  }

  async getReparacionesPorVehiculo(vehiculoId: number): Promise<Reparacion[]> {
    return this.repository.getReparaciones(vehiculoId);
  }
}