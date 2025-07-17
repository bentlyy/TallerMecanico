import { Usuario, CreateUsuario, UpdateUsuario, AuthCredentials } from "../entities/usuario";
import { Reparacion } from "../entities/reparacion";

export interface UsuarioRepository {
  getAll(): Promise<Usuario[]>;
  getById(id: number): Promise<Usuario | null>;

  create(data: CreateUsuario): Promise<Usuario>;
  update(id: number, data: UpdateUsuario): Promise<Usuario | null>;
  delete(id: number): Promise<void>;
  activate(id: number): Promise<Usuario | null>;
  deactivate(id: number): Promise<Usuario | null>;
  getByRol(rolId: number): Promise<Usuario[]>;
  getReparacionesAsRecepcionista(usuarioId: number): Promise<Reparacion[]>;
  authenticate(credentials: AuthCredentials): Promise<Usuario | null>;
}