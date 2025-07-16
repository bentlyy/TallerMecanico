import { ReparacionRepository } from '../domain/repositories/reparacionRepository';
import { Reparacion, EstadoReparacion } from '../domain/entities/reparacion';
import { DetalleReparacion } from '../domain/entities/detalleReparacion';

export class ReparacionService {
  constructor(private readonly repository: ReparacionRepository) {}

  async getAllReparaciones(): Promise<Reparacion[]> {
    return this.repository.getAll();
  }

  async getReparacionById(id: number): Promise<Reparacion | null> {
    return this.repository.getById(id);
  }

  async createReparacion(data: Reparacion): Promise<Reparacion> {
    return this.repository.create(data);
  }

  async updateReparacion(id: number, data: Partial<Reparacion>): Promise<Reparacion | null> {
    return this.repository.update(id, data);
  }

  async deleteReparacion(id: number): Promise<void> {
    return this.repository.delete(id);
  }

  async cambiarEstadoReparacion(id: number, nuevoEstado: EstadoReparacion): Promise<Reparacion | null> {
    return this.repository.cambiarEstado(id, nuevoEstado);
  }

  async asignarMecanico(reparacionId: number, mecanicoId: number): Promise<Reparacion | null> {
    return this.repository.asignarMecanico(reparacionId, mecanicoId);
  }

  async registrarSalida(id: number, fechaSalida: Date): Promise<Reparacion | null> {
    return this.repository.registrarSalida(id, fechaSalida);
  }

  async getDetallesReparacion(reparacionId: number): Promise<DetalleReparacion[]> {
    return this.repository.getDetalles(reparacionId);
  }

  async getReparacionesPorVehiculo(vehiculoId: number): Promise<Reparacion[]> {
    return this.repository.getByVehiculo(vehiculoId);
  }

  async getReparacionesPorMecanico(mecanicoId: number): Promise<Reparacion[]> {
    return this.repository.getByMecanico(mecanicoId);
  }

  async getReparacionesPorRecepcionista(usuarioId: number): Promise<Reparacion[]> {
    return this.repository.getByRecepcionista(usuarioId);
  }
}