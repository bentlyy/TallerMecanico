import { Reparacion, CreateReparacion, UpdateReparacion, EstadoReparacion } from "../entities/reparacion";
import { DetalleReparacion } from "../entities/detalleReparacion";

export interface ReparacionRepository {
  getAll(): Promise<Reparacion[]>;
  getById(id: number): Promise<Reparacion | null>;
  create(data: CreateReparacion): Promise<Reparacion>;
  update(id: number, data: UpdateReparacion): Promise<Reparacion | null>;
  delete(id: number): Promise<void>;
  cambiarEstado(id: number, estado: EstadoReparacion): Promise<Reparacion | null>;
  asignarMecanico(reparacionId: number, mecanicoId: number): Promise<Reparacion | null>;
  registrarSalida(id: number, fechaSalida: Date): Promise<Reparacion | null>;
  getDetalles(reparacionId: number): Promise<DetalleReparacion[]>;
  getByVehiculo(vehiculoId: number): Promise<Reparacion[]>;
  getByMecanico(mecanicoId: number): Promise<Reparacion[]>;
  getByRecepcionista(usuarioId: number): Promise<Reparacion[]>;
}