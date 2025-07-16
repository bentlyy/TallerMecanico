import { DetalleReparacion, CreateDetalle, UpdateDetalle } from "../entities/detalleReparacion";

export interface DetalleReparacionRepository {
  create(data: CreateDetalle): Promise<DetalleReparacion>;
  delete(reparacionId: number, piezaId: number): Promise<void>;
  update(reparacionId: number, piezaId: number, data: UpdateDetalle): Promise<DetalleReparacion | null>;
  getByReparacion(reparacionId: number): Promise<DetalleReparacion[]>;
  calcularTotalRepuestos(reparacionId: number): Promise<number>;
}