import { DetalleReparacionRepository } from '../domain/repositories/detalleReparacionRepository';
import { CreateDetalleReparacion, UpdateDetalleReparacion, DetalleReparacion } from '../domain/entities/detalleReparacion';

export class DetalleReparacionService {
  constructor(private readonly repo: DetalleReparacionRepository) {}

  agregarDetalle(data: CreateDetalleReparacion): Promise<DetalleReparacion> {
    return this.repo.agregarDetalle(data);
  }

  eliminarDetalle(reparacionId: number, piezaId: number): Promise<void> {
    return this.repo.eliminarDetalle(reparacionId, piezaId);
  }

  actualizarDetalle(reparacionId: number, piezaId: number, data: UpdateDetalleReparacion): Promise<DetalleReparacion | null> {
    return this.repo.actualizarDetalle(reparacionId, piezaId, data);
  }

  getDetallesDeReparacion(reparacionId: number): Promise<DetalleReparacion[]> {
    return this.repo.getDetallesDeReparacion(reparacionId);
  }

  calcularTotalRepuestos(reparacionId: number): Promise<number> {
    return this.repo.calcularTotalRepuestos(reparacionId);
  }
}
