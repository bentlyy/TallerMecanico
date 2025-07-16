import { Pieza } from "../entities/pieza";

export interface PiezaRepository {
  getAll(): Promise<Pieza[]>;
  getById(id: number): Promise<Pieza | null>;
  getByCodigo(codigo: string): Promise<Pieza | null>;
  create(data: Omit<Pieza, "id">): Promise<Pieza>;
  update(id: number, data: Partial<Omit<Pieza, "id">>): Promise<Pieza | null>;
  delete(id: number): Promise<void>;
}
