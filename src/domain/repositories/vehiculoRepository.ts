import { Vehiculo } from "../entities/vehiculo";

export interface VehiculoRepository {
  getAll(): Promise<Vehiculo[]>;
  getById(id: number): Promise<Vehiculo | null>;
  create(vehiculo: Omit<Vehiculo, "id">): Promise<Vehiculo>;
  getByCliente(clienteId: number): Promise<Vehiculo[]>;
}
