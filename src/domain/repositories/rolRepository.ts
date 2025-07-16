import { Rol, CreateRol, UpdateRol, Permisos } from "../entities/rol";

export interface RolRepository {
  getAll(): Promise<Rol[]>;
  getById(id: number): Promise<Rol | null>;
  create(data: CreateRol): Promise<Rol>;
  update(id: number, data: UpdateRol): Promise<Rol | null>;
  delete(id: number): Promise<void>;
  getPermisos(id: number): Promise<Permisos | null>;
}