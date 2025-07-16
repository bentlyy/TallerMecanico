import { Reparacion } from "../entities/reparacion";

export interface ReparacionRepository {
  getAll(): Promise<Reparacion[]>;
  getById(id: number): Promise<Reparacion | null>;
  create(data: Omit<Reparacion, "id">): Promise<Reparacion>;
  update(id: number, data: Partial<Omit<Reparacion, "id">>): Promise<Reparacion | null>;
  delete(id: number): Promise<void>;
}
