import { MecanicoRepository } from '../domain/repositories/mecanicoRepository';
import { Mecanico, CreateMecanico, UpdateMecanico } from '../domain/entities/mecanico';
import { UsuarioService } from './usuarioService';

export class MecanicoService {
  constructor(
    private readonly mecanicoRepository: MecanicoRepository,
    private readonly usuarioService: UsuarioService
  ) {}

  async getAllMecanicos(): Promise<Mecanico[]> {
    return this.mecanicoRepository.getAll();
  }

  async getMecanicoById(id: number): Promise<Mecanico | null> {
    return this.mecanicoRepository.getById(id);
  }

  async getMecanicoByUsuarioId(usuarioId: number): Promise<Mecanico | null> {
    return this.mecanicoRepository.getByUsuarioId(usuarioId);
  }

  async createMecanico(data: CreateMecanico): Promise<Mecanico> {
    // Validar que el usuario exista
    const usuario = await this.usuarioService.getUsuarioById(data.usuarioId);
    if (!usuario) {
      throw new Error('El usuario especificado no existe');
    }

    // Validar que el usuario no sea ya un mecánico
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