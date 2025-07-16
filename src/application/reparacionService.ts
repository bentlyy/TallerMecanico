import { ReparacionRepository } from "../domain/repositories/reparacionRepository";
import { Reparacion } from "../domain/entities/reparacion";

export class ReparacionService {
  constructor(private reparacionRepository: ReparacionRepository) {}

  async listar(): Promise<Reparacion[]> {
    return this.reparacionRepository.getAll();
  }

  async obtenerPorId(id: number): Promise<Reparacion | null> {
    return this.reparacionRepository.getById(id);
  }

  async crear(data: Omit<Reparacion, "id">): Promise<Reparacion> {
    return this.reparacionRepository.create(data);
  }

  async actualizar(id: number, data: Partial<Omit<Reparacion, "id">>): Promise<Reparacion | null> {
    return this.reparacionRepository.update(id, data);
  }

  async eliminar(id: number): Promise<void> {
    return this.reparacionRepository.delete(id);
  }
}
