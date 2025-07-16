import { MecanicoRepository } from '../domain/repositories/mecanicoRepository';
import { Mecanico } from '../domain/entities/mecanico';
import { Reparacion } from '../domain/entities/reparacion';

export class MecanicoService {
  constructor(private readonly repository: MecanicoRepository) {}

  async getAllMecanicos(): Promise<Mecanico[]> {
    return this.repository.getAll();
  }

  async getMecanicoById(id: number): Promise<Mecanico | null> {
    return this.repository.getById(id);
  }

  async createMecanico(usuarioId: number, especialidad?: string): Promise<Mecanico> {
    return this.repository.create({ 
      usuarioId, 
      especialidad: especialidad || null 
    });
  }

  async updateMecanico(id: number, data: Partial<Mecanico>): Promise<Mecanico | null> {
    return this.repository.update(id, data);
  }

  async getReparacionesAsignadas(mecanicoId: number): Promise<Reparacion[]> {
    return this.repository.getReparacionesAsignadas(mecanicoId);
  }
}