import { UsuarioRepository } from "../domain/repositories/usuarioRepository";
import { Usuario } from "../domain/entities/usuario";

export class UsuarioService {
  constructor(private usuarioRepository: UsuarioRepository) {}

  async listarUsuarios(): Promise<Usuario[]> {
    return this.usuarioRepository.getAll();
  }

  async obtenerUsuario(id: number): Promise<Usuario | null> {
    return this.usuarioRepository.getById(id);
  }

  async crearUsuario(data: Omit<Usuario, "id">): Promise<Usuario> {
    return this.usuarioRepository.create(data);
  }

  async actualizarUsuario(id: number, data: Partial<Omit<Usuario, "id">>): Promise<Usuario | null> {
    return this.usuarioRepository.update(id, data);
  }

  async eliminarUsuario(id: number): Promise<void> {
    return this.usuarioRepository.delete(id);
  }

  async obtenerPorEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepository.getByEmail(email);
  }
}
