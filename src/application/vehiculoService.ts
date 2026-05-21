import { VehiculoRepository } from '../domain/repositories/vehiculoRepository';
import { Vehiculo, CreateVehiculo, UpdateVehiculo } from '../domain/entities/vehiculo';
import { Reparacion } from '../domain/entities/reparacion';
import { ClienteRepository } from '../domain/repositories/clienteRepository';
import { PaginatedResult } from '../domain/types/pagination';

export class VehiculoService {
  constructor(
    private readonly vehiculoRepository: VehiculoRepository,
    private readonly clienteRepository: ClienteRepository,
  ) {}

  async getAllVehiculos(page = 1, limit = 20): Promise<PaginatedResult<Vehiculo>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.vehiculoRepository.getAll(skip, limit),
      this.vehiculoRepository.count(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
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
