import { Vehiculo, CreateVehiculo, UpdateVehiculo } from "../entities/vehiculo";
import { Reparacion } from "../entities/reparacion";

export interface VehiculoRepository {
  getAll(): Promise<Vehiculo[]>;
  getById(id: number): Promise<Vehiculo | null>;
  create(data: CreateVehiculo): Promise<Vehiculo>;
  update(id: number, data: UpdateVehiculo): Promise<Vehiculo | null>;
  delete(id: number): Promise<void>;
  getByCliente(clienteId: number): Promise<Vehiculo[]>;
  getReparaciones(vehiculoId: number): Promise<Reparacion[]>;
}