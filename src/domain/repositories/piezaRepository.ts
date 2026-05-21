import { Pieza, CreatePieza, UpdatePieza } from '../entities/pieza';

export interface PiezaRepository {
  getAll(empresaId?: number, skip?: number, limit?: number): Promise<Pieza[]>;
  count(empresaId?: number): Promise<number>;
  getById(id: number): Promise<Pieza | null>;
  getByCodigo(codigo: string, empresaId: number): Promise<Pieza | null>;
  create(data: CreatePieza): Promise<Pieza>;
  update(id: number, data: UpdatePieza): Promise<Pieza | null>;
  delete(id: number): Promise<void>;
  updateStock(id: number, cantidad: number): Promise<Pieza | null>;
}
