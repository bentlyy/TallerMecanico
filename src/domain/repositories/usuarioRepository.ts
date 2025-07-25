import { Usuario, CreateUsuario, UpdateUsuario } from "../entities/usuario";

export interface UsuarioRepository {
  getAll(): Promise<Usuario[]>;
  getById(id: number): Promise<Usuario | null>;
  getByEmail(email: string): Promise<Usuario | null>;
  create(data: CreateUsuario): Promise<Usuario>;
  update(id: number, data: UpdateUsuario): Promise<Usuario | null>;
  delete(id: number): Promise<void>;
  activate(id: number): Promise<Usuario | null>;
  deactivate(id: number): Promise<Usuario | null>;
}