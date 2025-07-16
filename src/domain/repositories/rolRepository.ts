import { Rol } from "../entities/rol";

export interface RolRepository {
  getAll(): Promise<Rol[]>;
  getById(id: number): Promise<Rol | null>;
  getByNombre(nombre: string): Promise<Rol | null>;
  create(data: Omit<Rol, "id">): Promise<Rol>;
  update(id: number, data: Partial<Omit<Rol, "id">>): Promise<Rol | null>;
  delete(id: number): Promise<void>;
}
