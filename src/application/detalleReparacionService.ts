import { DetalleReparacionRepository } from '../domain/repositories/detalleReparacionRepository';
import { DetalleReparacion } from '../domain/entities/detalleReparacion';

export class DetalleReparacionService {
  constructor(private readonly repository: DetalleReparacionRepository) {}

  async agregarDetalle(reparacionId: number, piezaId: number, cantidad: number, precioUnitario: number): Promise<DetalleReparacion> {
    return this.repository.create({ reparacionId, piezaId, cantidad, precioUnitario });
  }

  async eliminarDetalle(reparacionId: number, piezaId: number): Promise<void> {
    return this.repository.delete(reparacionId, piezaId);
  }

  async actualizarDetalle(reparacionId: number, piezaId: number, data: Partial<DetalleReparacion>): Promise<DetalleReparacion | null> {
    return this.repository.update(reparacionId, piezaId, data);
  }

  async getDetallesDeReparacion(reparacionId: number): Promise<DetalleReparacion[]> {
    return this.repository.getByReparacion(reparacionId);
  }

  async calcularTotalRepuestos(reparacionId: number): Promise<number> {
    return this.repository.calcularTotalRepuestos(reparacionId);
  }
}