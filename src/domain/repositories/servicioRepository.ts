import { Servicio, CreateServicio, UpdateServicio } from '../entities/servicio';

export interface ServicioRepository {
  getAll(empresaId: number, skip?: number, limit?: number): Promise<Servicio[]>;
  count(empresaId: number): Promise<number>;
  getById(id: number): Promise<Servicio | null>;
  getByNombre(nombre: string, empresaId: number): Promise<Servicio | null>;
  create(data: CreateServicio): Promise<Servicio>;
  update(id: number, data: UpdateServicio): Promise<Servicio | null>;
  delete(id: number): Promise<void>;
}
