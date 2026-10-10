import { UbicacionRepository } from '../domain/repositories/ubicacionRepository';
import { ReparacionRepository } from '../domain/repositories/reparacionRepository';
import { Ubicacion, CreateUbicacion, UpdateUbicacion, MovimientoUbicacion } from '../domain/entities/ubicacion';
import { ConflictError, NotFoundError } from '../infrastructure/http/errors';

export class UbicacionService {
  constructor(
    private readonly ubicacionRepository: UbicacionRepository,
    private readonly reparacionRepository: ReparacionRepository,
  ) {}

  async getAllUbicaciones(empresaId: number, includeInactive = false): Promise<Ubicacion[]> {
    return this.ubicacionRepository.getAll(empresaId, includeInactive);
  }

  async createUbicacion(data: CreateUbicacion): Promise<Ubicacion> {
    const existente = await this.ubicacionRepository.getByNombre(data.nombre, data.empresaId);
    if (existente) {
      throw new ConflictError('Ya existe una ubicación con ese nombre');
    }
    return this.ubicacionRepository.create(data);
  }

  async updateUbicacion(id: number, data: UpdateUbicacion, empresaId: number): Promise<Ubicacion | null> {
    const actual = await this.ubicacionRepository.getById(id);
    if (!actual) throw new NotFoundError('Ubicación');

    if (data.nombre && data.nombre !== actual.nombre) {
      const existente = await this.ubicacionRepository.getByNombre(data.nombre, empresaId);
      if (existente && existente.id !== id) {
        throw new ConflictError('Ya existe otra ubicación con ese nombre');
      }
    }
    return this.ubicacionRepository.update(id, data);
  }

  async deleteUbicacion(id: number): Promise<void> {
    const actual = await this.ubicacionRepository.getById(id);
    if (!actual) throw new NotFoundError('Ubicación');
    const enUso = await this.ubicacionRepository.countReparacionesActivas(id);
    if (enUso > 0) {
      throw new ConflictError('No se puede eliminar: hay reparaciones ocupando esta ubicación');
    }
    await this.ubicacionRepository.delete(id);
  }

  async moverReparacion(
    reparacionId: number,
    ubicacionId: number | null,
    usuarioId: number,
    nota?: string | null,
  ): Promise<MovimientoUbicacion> {
    const reparacion = await this.reparacionRepository.getById(reparacionId);
    if (!reparacion) throw new NotFoundError('Reparación');

    let nombre: string | null = null;
    if (ubicacionId != null) {
      const ubicacion = await this.ubicacionRepository.getById(ubicacionId);
      if (!ubicacion) throw new NotFoundError('Ubicación');
      nombre = ubicacion.nombre;
    }

    await this.reparacionRepository.update(reparacionId, { ubicacionId: ubicacionId ?? null });

    return this.ubicacionRepository.createMovimiento({
      reparacionId,
      ubicacionId: ubicacionId ?? null,
      ubicacionNombre: nombre,
      usuarioId,
      nota: nota ?? null,
    });
  }

  async getHistorial(reparacionId: number): Promise<MovimientoUbicacion[]> {
    const reparacion = await this.reparacionRepository.getById(reparacionId);
    if (!reparacion) throw new NotFoundError('Reparación');
    return this.ubicacionRepository.getMovimientos(reparacionId);
  }
}
