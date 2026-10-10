import {
  Ubicacion,
  CreateUbicacion,
  UpdateUbicacion,
  MovimientoUbicacion,
  CreateMovimientoUbicacion,
} from '../entities/ubicacion';

export interface UbicacionRepository {
  getAll(empresaId: number, includeInactive?: boolean): Promise<Ubicacion[]>;
  getById(id: number): Promise<Ubicacion | null>;
  getByNombre(nombre: string, empresaId: number): Promise<Ubicacion | null>;
  countReparacionesActivas(id: number): Promise<number>;
  create(data: CreateUbicacion): Promise<Ubicacion>;
  update(id: number, data: UpdateUbicacion): Promise<Ubicacion | null>;
  delete(id: number): Promise<void>;

  getMovimientos(reparacionId: number): Promise<MovimientoUbicacion[]>;
  createMovimiento(data: CreateMovimientoUbicacion): Promise<MovimientoUbicacion>;
}
