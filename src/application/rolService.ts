import { RolRepository } from "../domain/repositories/rolRepository";
import { Rol } from "../domain/entities/rol";

export class RolService {
  constructor(private rolRepository: RolRepository) {}

  async listarRoles(): Promise<Rol[]> {
    return this.rolRepository.getAll();
  }

  async obtenerRol(id: number): Promise<Rol | null> {
    return this.rolRepository.getById(id);
  }

  async obtenerPorNombre(nombre: string): Promise<Rol | null> {
    return this.rolRepository.getByNombre(nombre);
  }

  async crearRol(data: Omit<Rol, "id">): Promise<Rol> {
    return this.rolRepository.create(data);
  }

  async actualizarRol(id: number, data: Partial<Omit<Rol, "id">>): Promise<Rol | null> {
    return this.rolRepository.update(id, data);
  }

  async eliminarRol(id: number): Promise<void> {
    return this.rolRepository.delete(id);
  }
}
