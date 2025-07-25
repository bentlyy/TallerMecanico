import { Pieza, CreatePieza, UpdatePieza } from "../entities/pieza";

export interface PiezaRepository {
  getAll(): Promise<Pieza[]>;
  getById(id: number): Promise<Pieza | null>;
  getByCodigo(codigo: string): Promise<Pieza | null>;
  create(data: CreatePieza): Promise<Pieza>;
  update(id: number, data: UpdatePieza): Promise<Pieza | null>;
  delete(id: number): Promise<void>;
  updateStock(id: number, cantidad: number): Promise<Pieza | null>;
}