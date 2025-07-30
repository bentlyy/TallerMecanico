import { DetalleReparacion, CreateDetalleReparacion, UpdateDetalleReparacion } from "../entities/detalleReparacion";

export interface DetalleReparacionRepository {
  getAll(): Promise<DetalleReparacion[]>;
  getById(id: number): Promise<DetalleReparacion | null>;
  create(data: CreateDetalleReparacion): Promise<DetalleReparacion>;
  update(id: number, data: UpdateDetalleReparacion): Promise<DetalleReparacion | null>;
  delete(id: number): Promise<void>;
  getByReparacion(reparacionId: number): Promise<DetalleReparacion[]>;
  getByPieza(piezaId: number): Promise<DetalleReparacion[]>;
  getByReparacionAndPieza(reparacionId: number, piezaId: number): Promise<DetalleReparacion | null>;
  updateCantidad(id: number, cantidad: number): Promise<DetalleReparacion | null>;
}