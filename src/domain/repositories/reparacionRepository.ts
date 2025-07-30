import { Reparacion, CreateReparacion, UpdateReparacion, EstadoReparacion } from "../entities/reparacion";
import { DetalleReparacion } from "../entities/detalleReparacion";

export interface ReparacionRepository {
  getAll(): Promise<Reparacion[]>;
  getById(id: number): Promise<Reparacion | null>;
  create(data: CreateReparacion): Promise<Reparacion>;
  update(id: number, data: UpdateReparacion): Promise<Reparacion | null>;
  delete(id: number): Promise<void>;
  updateEstado(id: number, estado: EstadoReparacion): Promise<Reparacion | null>;
  asignarMecanico(id: number, mecanicoId: number | null): Promise<Reparacion | null>;
  registrarSalida(id: number, fechaSalida: Date): Promise<Reparacion | null>;
  getDetallesReparacion(reparacionId: number): Promise<DetalleReparacion[]>;
  getByVehiculo(vehiculoId: number): Promise<Reparacion[]>;
  getByMecanico(mecanicoId: number): Promise<Reparacion[]>;
  getByRecepcionista(recepcionistaId: number): Promise<Reparacion[]>;
  addDetalleReparacion(reparacionId: number, piezaId: number, cantidad: number, precioUnitario: number): Promise<DetalleReparacion>;
  removeDetalleReparacion(reparacionId: number, piezaId: number): Promise<void>;
}