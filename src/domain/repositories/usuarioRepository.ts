// src/domain/repositories/usuarioRepository.ts
import { Usuario, CreateUsuario, UpdateUsuario } from '../entities/usuario';

export interface UsuarioRepository {
  getAll(empresaId?: number, skip?: number, limit?: number): Promise<Usuario[]>;
  count(empresaId?: number): Promise<number>;
  getById(id: number): Promise<Usuario | null>;
  getByEmail(email: string, empresaId: number): Promise<Usuario | null>;
  create(data: CreateUsuario): Promise<Usuario>;
  update(id: number, data: UpdateUsuario): Promise<Usuario | null>;
  delete(id: number): Promise<void>;
  activate(id: number): Promise<Usuario | null>;
  deactivate(id: number): Promise<Usuario | null>;
}
