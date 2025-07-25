import { UsuarioRepository } from '../domain/repositories/usuarioRepository';
import { Usuario, CreateUsuario, UpdateUsuario } from '../domain/entities/usuario';
import { RolService } from './rolService';

export class UsuarioService {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly rolService: RolService
  ) {}

  async getAllUsuarios(): Promise<Usuario[]> {
    return this.usuarioRepository.getAll();
  }

  async getUsuarioById(id: number): Promise<Usuario | null> {
    return this.usuarioRepository.getById(id);
  }

  async getUsuarioByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepository.getByEmail(email);
  }

  async createUsuario(data: CreateUsuario): Promise<Usuario> {
    // Validar que el rol exista
    const rol = await this.rolService.getRolById(data.rolId);
    if (!rol) {
      throw new Error('El rol especificado no existe');
    }

    // Validar email único
    const existingUser = await this.usuarioRepository.getByEmail(data.email);
    if (existingUser) {
      throw new Error('Ya existe un usuario con este email');
    }

    return this.usuarioRepository.create(data);
  }

  async updateUsuario(id: number, data: UpdateUsuario): Promise<Usuario | null> {
    if (data.rolId) {
      const rol = await this.rolService.getRolById(data.rolId);
      if (!rol) {
        throw new Error('El rol especificado no existe');
      }
    }

    return this.usuarioRepository.update(id, data);
  }

  async deleteUsuario(id: number): Promise<void> {
    return this.usuarioRepository.delete(id);
  }

  async activateUsuario(id: number): Promise<Usuario | null> {
    return this.usuarioRepository.activate(id);
  }

  async deactivateUsuario(id: number): Promise<Usuario | null> {
    return this.usuarioRepository.deactivate(id);
  }
}