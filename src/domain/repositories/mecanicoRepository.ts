import { Mecanico, CreateMecanico, UpdateMecanico } from '../entities/mecanico';

export interface MecanicoRepository {
  getAll(skip?: number, limit?: number): Promise<Mecanico[]>;
  count(): Promise<number>;
  getById(id: number): Promise<Mecanico | null>;
  getByUsuarioId(usuarioId: number): Promise<Mecanico | null>;
  create(data: CreateMecanico): Promise<Mecanico>;
  update(id: number, data: UpdateMecanico): Promise<Mecanico | null>;
  delete(id: number): Promise<void>;
}
