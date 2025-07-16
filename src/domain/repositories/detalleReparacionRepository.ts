import { DetalleReparacion } from "../entities/detalleReparacion";

export interface DetalleReparacionRepository {
  getByReparacionId(reparacionId: number): Promise<DetalleReparacion[]>;
  addDetalle(detalle: DetalleReparacion): Promise<DetalleReparacion>;
  updateDetalle(reparacionId: number, piezaId: number, data: Partial<Omit<DetalleReparacion, "reparacionId" | "piezaId">>): Promise<DetalleReparacion | null>;
  deleteDetalle(reparacionId: number, piezaId: number): Promise<void>;
}
