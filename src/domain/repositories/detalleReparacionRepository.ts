// src/domain/repositories/detalleReparacionRepository.ts
import { DetalleReparacion, CreateDetalleReparacion, UpdateDetalleReparacion } from '../entities/detalleReparacion';

export interface DetalleReparacionRepository {
  agregarDetalle(data: CreateDetalleReparacion): Promise<DetalleReparacion>;
  eliminarDetalle(reparacionId: number, piezaId: number): Promise<void>;
  actualizarDetalle(reparacionId: number, piezaId: number, data: UpdateDetalleReparacion): Promise<DetalleReparacion | null>;
  getDetallesDeReparacion(reparacionId: number): Promise<DetalleReparacion[]>;
  calcularTotalRepuestos(reparacionId: number): Promise<number>;
}
