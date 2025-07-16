import { DetalleReparacion } from "../domain/entities/detalleReparacion";
import { DetalleReparacionRepository } from "../domain/repositories/detalleReparacionRepository";

export class DetalleReparacionService {
  constructor(private repo: DetalleReparacionRepository) {}

  async obtenerPorReparacion(reparacionId: number): Promise<DetalleReparacion[]> {
    return this.repo.getByReparacionId(reparacionId);
  }

  async agregarDetalle(detalle: DetalleReparacion): Promise<DetalleReparacion> {
    return this.repo.addDetalle(detalle);
  }

  async actualizarDetalle(
    reparacionId: number,
    piezaId: number,
    data: Partial<Omit<DetalleReparacion, "reparacionId" | "piezaId">>
  ): Promise<DetalleReparacion | null> {
    return this.repo.updateDetalle(reparacionId, piezaId, data);
  }

  async eliminarDetalle(reparacionId: number, piezaId: number): Promise<void> {
    await this.repo.deleteDetalle(reparacionId, piezaId);
  }
}
