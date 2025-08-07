import { Reparacion, CreateReparacion, UpdateReparacion } from '../entities/reparacion';

export interface ReparacionRepository {
  getAll(): Promise<Reparacion[]>;
  getById(id: number): Promise<Reparacion | null>;
  create(data: CreateReparacion): Promise<Reparacion>;
  update(id: number, data: UpdateReparacion): Promise<Reparacion | null>;
  delete(id: number): Promise<void>;
  cambiarEstado(id: number, estado: string): Promise<Reparacion | null>;
  asignarMecanico(id: number, mecanicoId: number): Promise<Reparacion | null>;
  registrarSalida(id: number, fecha: Date): Promise<Reparacion | null>;
  getByVehiculo(vehiculoId: number): Promise<Reparacion[]>;
  getByMecanico(mecanicoId: number): Promise<Reparacion[]>;
  getByRecepcionista(usuarioId: number): Promise<Reparacion[]>;
}