import { Vehiculo } from "../entities/vehiculo";

export interface VehiculoRepository {
  getAll(): Promise<Vehiculo[]>;
  getById(id: number): Promise<Vehiculo | null>;
  create(data: Omit<Vehiculo, "id">): Promise<Vehiculo>;
  update(id: number, data: Partial<Omit<Vehiculo, "id">>): Promise<Vehiculo | null>;
  delete(id: number): Promise<void>;
}
