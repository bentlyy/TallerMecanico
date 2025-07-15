import { Vehiculo } from "../domain/entities/vehiculo";
import { VehiculoRepository } from "../domain/repositories/vehiculoRepository";

export class VehiculoService {
  constructor(private vehiculoRepository: VehiculoRepository) {}

  async listar(): Promise<Vehiculo[]> {
    return this.vehiculoRepository.getAll();
  }

  async listarPorCliente(clienteId: number): Promise<Vehiculo[]> {
    return this.vehiculoRepository.getByCliente(clienteId);
  }

  async crear(data: Omit<Vehiculo, "id">): Promise<Vehiculo> {
    return this.vehiculoRepository.create(data);
  }

  async obtener(id: number): Promise<Vehiculo | null> {
    return this.vehiculoRepository.getById(id);
  }
}
