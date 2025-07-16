import { PiezaRepository } from '../domain/repositories/piezaRepository';
import { Pieza } from '../domain/entities/pieza';

export class PiezaService {
  constructor(private readonly repository: PiezaRepository) {}

  async getAllPiezas(): Promise<Pieza[]> {
    return this.repository.getAll();
  }

  async getPiezaById(id: number): Promise<Pieza | null> {
    return this.repository.getById(id);
  }

  async createPieza(data: Pieza): Promise<Pieza> {
    return this.repository.create(data);
  }

  async updatePieza(id: number, data: Partial<Pieza>): Promise<Pieza | null> {
    return this.repository.update(id, data);
  }

  async deletePieza(id: number): Promise<void> {
    return this.repository.delete(id);
  }

  async getPiezaByCodigo(codigo: string): Promise<Pieza | null> {
    return this.repository.getByCodigo(codigo);
  }

  async actualizarStock(id: number, nuevaCantidad: number): Promise<Pieza | null> {
    return this.repository.updateStock(id, nuevaCantidad);
  }

  async descontarStock(id: number, cantidad: number): Promise<Pieza | null> {
    return this.repository.decreaseStock(id, cantidad);
  }
}