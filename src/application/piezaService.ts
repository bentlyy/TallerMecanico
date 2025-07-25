import { PiezaRepository } from '../domain/repositories/piezaRepository';
import { Pieza, CreatePieza, UpdatePieza } from '../domain/entities/pieza';

export class PiezaService {
  constructor(private readonly piezaRepository: PiezaRepository) {}

  async getAllPiezas(): Promise<Pieza[]> {
    return this.piezaRepository.getAll();
  }

  async getPiezaById(id: number): Promise<Pieza | null> {
    return this.piezaRepository.getById(id);
  }

  async getPiezaByCodigo(codigo: string): Promise<Pieza | null> {
    return this.piezaRepository.getByCodigo(codigo);
  }

  async createPieza(data: CreatePieza): Promise<Pieza> {
    // Validar código único
    const existingPieza = await this.piezaRepository.getByCodigo(data.codigo);
    if (existingPieza) {
      throw new Error('Ya existe una pieza con este código');
    }
    return this.piezaRepository.create(data);
  }

  async updatePieza(id: number, data: UpdatePieza): Promise<Pieza | null> {
    if (data.codigo) {
      const existingPieza = await this.piezaRepository.getByCodigo(data.codigo);
      if (existingPieza && existingPieza.id !== id) {
        throw new Error('Ya existe otra pieza con este código');
      }
    }
    return this.piezaRepository.update(id, data);
  }

  async deletePieza(id: number): Promise<void> {
    return this.piezaRepository.delete(id);
  }

  async updateStock(id: number, cantidad: number): Promise<Pieza | null> {
    return this.piezaRepository.updateStock(id, cantidad);
  }
}