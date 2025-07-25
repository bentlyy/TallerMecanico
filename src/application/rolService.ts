import { RolRepository } from '../domain/repositories/rolRepository';
import { Rol, CreateRol, UpdateRol } from '../domain/entities/rol';

export class RolService {
  constructor(private readonly rolRepository: RolRepository) {}

  async getAllRoles(): Promise<Rol[]> {
    return this.rolRepository.getAll();
  }

  async getRolById(id: number): Promise<Rol | null> {
    return this.rolRepository.getById(id);
  }

  async getRolByNombre(nombre: string): Promise<Rol | null> {
    return this.rolRepository.getByNombre(nombre);
  }

  async createRol(data: CreateRol): Promise<Rol> {
    const existingRol = await this.rolRepository.getByNombre(data.nombre);
    if (existingRol) {
      throw new Error('Ya existe un rol con este nombre');
    }
    return this.rolRepository.create(data);
  }

  async updateRol(id: number, data: UpdateRol): Promise<Rol | null> {
    if (data.nombre) {
      const existingRol = await this.rolRepository.getByNombre(data.nombre);
      if (existingRol && existingRol.id !== id) {
        throw new Error('Ya existe un rol con este nombre');
      }
    }
    return this.rolRepository.update(id, data);
  }

  async deleteRol(id: number): Promise<void> {
    return this.rolRepository.delete(id);
  }
}