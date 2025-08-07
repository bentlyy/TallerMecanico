import { ReparacionRepository } from '../domain/repositories/reparacionRepository';
import { Reparacion, CreateReparacion, UpdateReparacion } from '../domain/entities/reparacion';

export class ReparacionService {
  constructor(private readonly reparacionRepository: ReparacionRepository) {}

  getAllReparaciones(): Promise<Reparacion[]> {
    return this.reparacionRepository.getAll();
  }

  getReparacionById(id: number): Promise<Reparacion | null> {
    return this.reparacionRepository.getById(id);
  }

  createReparacion(data: CreateReparacion): Promise<Reparacion> {
    return this.reparacionRepository.create(data);
  }

  updateReparacion(id: number, data: UpdateReparacion): Promise<Reparacion | null> {
    return this.reparacionRepository.update(id, data);
  }

  deleteReparacion(id: number): Promise<void> {
    return this.reparacionRepository.delete(id);
  }

  cambiarEstadoReparacion(id: number, nuevoEstado: string): Promise<Reparacion | null> {
    return this.reparacionRepository.cambiarEstado(id, nuevoEstado);
  }

  asignarMecanico(id: number, mecanicoId: number): Promise<Reparacion | null> {
    return this.reparacionRepository.asignarMecanico(id, mecanicoId);
  }

  registrarSalida(id: number, fecha: Date): Promise<Reparacion | null> {
    return this.reparacionRepository.registrarSalida(id, fecha);
  }

  getReparacionesPorVehiculo(vehiculoId: number): Promise<Reparacion[]> {
    return this.reparacionRepository.getByVehiculo(vehiculoId);
  }

  getReparacionesPorMecanico(mecanicoId: number): Promise<Reparacion[]> {
    return this.reparacionRepository.getByMecanico(mecanicoId);
  }

  getReparacionesPorRecepcionista(usuarioId: number): Promise<Reparacion[]> {
    return this.reparacionRepository.getByRecepcionista(usuarioId);
  }
}