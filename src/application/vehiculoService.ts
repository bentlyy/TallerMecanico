import { VehiculoRepository } from "../domain/repositories/vehiculoRepository";
import { Vehiculo } from "../domain/entities/vehiculo";

export class VehiculoService {
  constructor(private vehiculoRepository: VehiculoRepository) {}

  async listarVehiculos(): Promise<Vehiculo[]> {
    return this.vehiculoRepository.getAll();
  }

  async obtenerVehiculo(id: number): Promise<Vehiculo | null> {
    return this.vehiculoRepository.getById(id);
  }

  async crearVehiculo(data: Omit<Vehiculo, "id">): Promise<Vehiculo> {
    return this.vehiculoRepository.create(data);
  }

  async actualizarVehiculo(id: number, data: Partial<Omit<Vehiculo, "id">>): Promise<Vehiculo | null> {
    return this.vehiculoRepository.update(id, data);
  }

  async eliminarVehiculo(id: number): Promise<void> {
    return this.vehiculoRepository.delete(id);
  }
}
