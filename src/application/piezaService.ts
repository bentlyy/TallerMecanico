import { PiezaRepository } from "../domain/repositories/piezaRepository";
import { Pieza } from "../domain/entities/pieza";

export class PiezaService {
  constructor(private piezaRepository: PiezaRepository) {}

  async listarPiezas(): Promise<Pieza[]> {
    return this.piezaRepository.getAll();
  }

  async obtenerPieza(id: number): Promise<Pieza | null> {
    return this.piezaRepository.getById(id);
  }

  async obtenerPorCodigo(codigo: string): Promise<Pieza | null> {
    return this.piezaRepository.getByCodigo(codigo);
  }

  async crearPieza(data: Omit<Pieza, "id">): Promise<Pieza> {
    return this.piezaRepository.create(data);
  }

  async actualizarPieza(id: number, data: Partial<Omit<Pieza, "id">>): Promise<Pieza | null> {
    return this.piezaRepository.update(id, data);
  }

  async eliminarPieza(id: number): Promise<void> {
    return this.piezaRepository.delete(id);
  }
}
