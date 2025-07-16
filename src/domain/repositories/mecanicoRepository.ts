import { Mecanico } from "../entities/mecanico";

export interface MecanicoRepository {
  getAll(): Promise<Mecanico[]>;
  getById(id: number): Promise<Mecanico | null>;
  getByUsuarioId(usuarioId: number): Promise<Mecanico | null>;
  create(data: Omit<Mecanico, "id">): Promise<Mecanico>;
  update(id: number, data: Partial<Omit<Mecanico, "id">>): Promise<Mecanico | null>;
  delete(id: number): Promise<void>;
}
