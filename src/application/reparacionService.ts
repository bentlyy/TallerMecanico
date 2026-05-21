import { ReparacionRepository } from '../domain/repositories/reparacionRepository';
import { Reparacion, CreateReparacion, UpdateReparacion } from '../domain/entities/reparacion';
import { PaginatedResult } from '../domain/types/pagination';

export class ReparacionService {
  constructor(private readonly reparacionRepository: ReparacionRepository) {}

  async getAllReparaciones(page = 1, limit = 20): Promise<PaginatedResult<Reparacion>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.reparacionRepository.getAll(skip, limit),
      this.reparacionRepository.count(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getReparacionById(id: number): Promise<Reparacion | null> {
    return this.reparacionRepository.getById(id);
  }

  async createReparacion(data: CreateReparacion): Promise<Reparacion> {
    return this.reparacionRepository.create(data);
  }

  async updateReparacion(id: number, data: UpdateReparacion): Promise<Reparacion | null> {
    return this.reparacionRepository.update(id, data);
  }

  async deleteReparacion(id: number): Promise<void> {
    return this.reparacionRepository.delete(id);
  }

  async cambiarEstadoReparacion(id: number, nuevoEstado: string): Promise<Reparacion | null> {
    return this.reparacionRepository.cambiarEstado(id, nuevoEstado);
  }

  async asignarMecanico(id: number, mecanicoId: number): Promise<Reparacion | null> {
    return this.reparacionRepository.asignarMecanico(id, mecanicoId);
  }

  async registrarSalida(id: number, fecha: Date): Promise<Reparacion | null> {
    return this.reparacionRepository.registrarSalida(id, fecha);
  }

  async getReparacionesPorVehiculo(vehiculoId: number): Promise<Reparacion[]> {
    return this.reparacionRepository.getByVehiculo(vehiculoId);
  }

  async getReparacionesPorMecanico(mecanicoId: number): Promise<Reparacion[]> {
    return this.reparacionRepository.getByMecanico(mecanicoId);
  }

  async getReparacionesPorRecepcionista(usuarioId: number): Promise<Reparacion[]> {
    return this.reparacionRepository.getByRecepcionista(usuarioId);
  }
}
