import { RolRepository } from '../domain/repositories/rolRepository';
import { Rol, Permisos } from '../domain/entities/rol';

export class RolService {
  constructor(private readonly repository: RolRepository) {}

  async getAllRoles(): Promise<Rol[]> {
    return this.repository.getAll();
  }

  async getRolById(id: number): Promise<Rol | null> {
    return this.repository.getById(id);
  }

  async createRol(data: Rol): Promise<Rol> {
    return this.repository.create(data);
  }

  async updateRol(id: number, data: Partial<Rol>): Promise<Rol | null> {
    return this.repository.update(id, data);
  }

  async deleteRol(id: number): Promise<void> {
    return this.repository.delete(id);
  }

  async getPermisosDeRol(rolId: number): Promise<Permisos | null> {
    return this.repository.getPermisos(rolId);
  }
}