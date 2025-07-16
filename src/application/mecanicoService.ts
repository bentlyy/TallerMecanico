import { MecanicoRepository } from "../domain/repositories/mecanicoRepository";
import { Mecanico } from "../domain/entities/mecanico";

export class MecanicoService {
  constructor(private mecanicoRepository: MecanicoRepository) {}

  async listarMecanicos(): Promise<Mecanico[]> {
    return this.mecanicoRepository.getAll();
  }

  async obtenerMecanico(id: number): Promise<Mecanico | null> {
    return this.mecanicoRepository.getById(id);
  }

  async obtenerPorUsuario(usuarioId: number): Promise<Mecanico | null> {
    return this.mecanicoRepository.getByUsuarioId(usuarioId);
  }

  async crearMecanico(data: Omit<Mecanico, "id">): Promise<Mecanico> {
    return this.mecanicoRepository.create(data);
  }

  async actualizarMecanico(id: number, data: Partial<Omit<Mecanico, "id">>): Promise<Mecanico | null> {
    return this.mecanicoRepository.update(id, data);
  }

  async eliminarMecanico(id: number): Promise<void> {
    return this.mecanicoRepository.delete(id);
  }
}
