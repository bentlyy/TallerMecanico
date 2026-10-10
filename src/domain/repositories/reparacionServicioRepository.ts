import { ReparacionServicio, CreateReparacionServicio } from '../entities/reparacionServicio';

export interface ReparacionServicioRepository {
  getByReparacion(reparacionId: number): Promise<ReparacionServicio[]>;
  getByReparacionAndServicio(reparacionId: number, servicioId: number): Promise<ReparacionServicio | null>;
  create(data: CreateReparacionServicio): Promise<ReparacionServicio>;
  updateCantidad(id: number, cantidad: number, precioUnitario: number): Promise<ReparacionServicio>;
  delete(reparacionId: number, servicioId: number): Promise<void>;
  sumByReparacion(reparacionId: number): Promise<number>;
}
