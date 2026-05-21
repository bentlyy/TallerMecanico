import { PiezaRepository } from '../domain/repositories/piezaRepository';
import { Pieza, CreatePieza, UpdatePieza } from '../domain/entities/pieza';
import { PaginatedResult } from '../domain/types/pagination';

export class PiezaService {
  constructor(private readonly piezaRepository: PiezaRepository) {}

  async getAllPiezas(empresaId: number, page = 1, limit = 20): Promise<PaginatedResult<Pieza>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.piezaRepository.getAll(empresaId, skip, limit),
      this.piezaRepository.count(empresaId),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getPiezaById(id: number): Promise<Pieza | null> {
    return this.piezaRepository.getById(id);
  }

  async getPiezaByCodigo(codigo: string, empresaId: number): Promise<Pieza | null> {
    return this.piezaRepository.getByCodigo(codigo, empresaId);
  }

  async createPieza(data: CreatePieza): Promise<Pieza> {
    const existingPieza = await this.piezaRepository.getByCodigo(data.codigo, data.empresaId);
    if (existingPieza) {
      throw new Error('Ya existe una pieza con este código');
    }
    return this.piezaRepository.create(data);
  }

  async updatePieza(id: number, data: UpdatePieza, empresaId: number): Promise<Pieza | null> {
    if (data.codigo) {
      const existingPieza = await this.piezaRepository.getByCodigo(data.codigo, empresaId);
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
