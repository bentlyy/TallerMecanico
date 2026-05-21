import { MecanicoRepository } from '../domain/repositories/mecanicoRepository';
import { Mecanico, CreateMecanico, UpdateMecanico } from '../domain/entities/mecanico';
import { UsuarioService } from './usuarioService';
import { PaginatedResult } from '../domain/types/pagination';

export class MecanicoService {
  constructor(
    private readonly mecanicoRepository: MecanicoRepository,
    private readonly usuarioService: UsuarioService,
  ) {}

  async getAll(page = 1, limit = 20): Promise<PaginatedResult<Mecanico>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.mecanicoRepository.getAll(skip, limit),
      this.mecanicoRepository.count(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getMecanicoById(id: number): Promise<Mecanico | null> {
    return this.mecanicoRepository.getById(id);
  }

  async getMecanicoByUsuarioId(usuarioId: number): Promise<Mecanico | null> {
    return this.mecanicoRepository.getByUsuarioId(usuarioId);
  }

  async createMecanico(data: CreateMecanico): Promise<Mecanico> {
    const usuario = await this.usuarioService.getUsuarioById(data.usuarioId);
    if (!usuario) {
      throw new Error('El usuario especificado no existe');
    }
    const existingMecanico = await this.mecanicoRepository.getByUsuarioId(data.usuarioId);
    if (existingMecanico) {
      throw new Error('Este usuario ya está registrado como mecánico');
    }
    return this.mecanicoRepository.create(data);
  }

  async updateMecanico(id: number, data: UpdateMecanico): Promise<Mecanico | null> {
    if (data.usuarioId) {
      const usuario = await this.usuarioService.getUsuarioById(data.usuarioId);
      if (!usuario) {
        throw new Error('El usuario especificado no existe');
      }
    }
    return this.mecanicoRepository.update(id, data);
  }

  async deleteMecanico(id: number): Promise<void> {
    return this.mecanicoRepository.delete(id);
  }
}
