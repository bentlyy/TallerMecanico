import { UsuarioRepository } from '../domain/repositories/usuarioRepository';
import { Usuario, AuthCredentials } from '../domain/entities/usuario';
import { Reparacion } from '../domain/entities/reparacion';

export class UsuarioService {
  constructor(private readonly repository: UsuarioRepository) {}

  async getAllUsuarios(): Promise<Usuario[]> {
    return this.repository.getAll();
  }

  async getUsuarioById(id: number): Promise<Usuario | null> {
    return this.repository.getById(id);
  }


  async createUsuario(data: Usuario): Promise<Usuario> {
    return this.repository.create(data);
  }

  async updateUsuario(id: number, data: Partial<Usuario>): Promise<Usuario | null> {
    return this.repository.update(id, data);
  }

  async deleteUsuario(id: number): Promise<void> {
    return this.repository.delete(id);
  }

  async activarUsuario(id: number): Promise<Usuario | null> {
    return this.repository.activate(id);
  }

  async desactivarUsuario(id: number): Promise<Usuario | null> {
    return this.repository.deactivate(id);
  }

  async getUsuariosPorRol(rolId: number): Promise<Usuario[]> {
    return this.repository.getByRol(rolId);
  }

  async verReparacionesAsignadasComoRecepcionista(usuarioId: number): Promise<Reparacion[]> {
    return this.repository.getReparacionesAsRecepcionista(usuarioId);
  }

  async autenticar(email: string, password: string): Promise<Usuario | null> {
    return this.repository.authenticate({ email, password });
  }
}