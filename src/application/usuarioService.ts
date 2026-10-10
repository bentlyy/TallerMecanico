import { UsuarioRepository } from '../domain/repositories/usuarioRepository';
import { Usuario, CreateUsuario, UpdateUsuario } from '../domain/entities/usuario';
import { RolService } from './rolService';
import { PaginatedResult } from '../domain/types/pagination';
import { ConflictError } from '../infrastructure/http/errors';

export class UsuarioService {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly rolService: RolService,
  ) {}

  async getAllUsuarios(empresaId: number, page = 1, limit = 20): Promise<PaginatedResult<Usuario>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.usuarioRepository.getAll(empresaId, skip, limit),
      this.usuarioRepository.count(empresaId),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getUsuarioById(id: number): Promise<Usuario | null> {
    return this.usuarioRepository.getById(id);
  }

  async getUsuarioByEmail(email: string, empresaId: number): Promise<Usuario | null> {
    return this.usuarioRepository.getByEmail(email, empresaId);
  }

  async createUsuario(data: CreateUsuario): Promise<Usuario> {
    const rol = await this.rolService.getRolById(data.rolId);
    if (!rol) {
      throw new Error('El rol especificado no existe');
    }
    const existingUser = await this.usuarioRepository.getByEmail(data.email, data.empresaId);
    if (existingUser) {
      throw new Error('Ya existe un usuario con este email');
    }
    return this.usuarioRepository.create(data);
  }

  async updateUsuario(
    id: number,
    data: UpdateUsuario,
    requesterId?: number,
    empresaId?: number,
  ): Promise<Usuario | null> {
    if (data.rolId) {
      const rol = await this.rolService.getRolById(data.rolId);
      if (!rol) {
        throw new Error('El rol especificado no existe');
      }
    }
    if (requesterId && empresaId && id === requesterId) {
      const adminRol = await this.rolService.getRolByNombre('ADMIN');
      const removingAdminAccess = data.activo === false || (data.rolId !== undefined && data.rolId !== adminRol?.id);
      if (removingAdminAccess) {
        await this.assertNotLastAdmin(id, empresaId, requesterId);
      }
    }
    return this.usuarioRepository.update(id, data);
  }

  async deleteUsuario(id: number, requesterId: number, empresaId: number): Promise<void> {
    await this.assertNotLastAdmin(id, empresaId, requesterId);
    return this.usuarioRepository.delete(id);
  }

  async activateUsuario(id: number): Promise<Usuario | null> {
    return this.usuarioRepository.activate(id);
  }

  async deactivateUsuario(id: number, requesterId: number, empresaId: number): Promise<Usuario | null> {
    await this.assertNotLastAdmin(id, empresaId, requesterId);
    return this.usuarioRepository.deactivate(id);
  }

  private async assertNotLastAdmin(targetId: number, empresaId: number, requesterId: number): Promise<void> {
    if (targetId !== requesterId) return;
    const target = await this.usuarioRepository.getById(targetId);
    if (!target || !target.activo) return;
    const adminRol = await this.rolService.getRolByNombre('ADMIN');
    if (!adminRol || target.rolId !== adminRol.id) return;
    const admins = await this.usuarioRepository.countActiveByRol(empresaId, adminRol.id);
    if (admins <= 1) {
      throw new ConflictError(
        'No puedes bloquear ni eliminar tu propio usuario porque eres el único administrador activo',
      );
    }
  }
}
