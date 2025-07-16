import { Usuario } from "../entities/usuario";

export interface UsuarioRepository {
  getAll(): Promise<Usuario[]>;
  getById(id: number): Promise<Usuario | null>;
  getByEmail(email: string): Promise<Usuario | null>;
  create(data: Omit<Usuario, "id">): Promise<Usuario>;
  update(id: number, data: Partial<Omit<Usuario, "id">>): Promise<Usuario | null>;
  delete(id: number): Promise<void>;
}
