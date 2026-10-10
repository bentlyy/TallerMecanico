import { ReparacionRepository } from '../domain/repositories/reparacionRepository';
import { ReparacionServicioRepository } from '../domain/repositories/reparacionServicioRepository';
import { ServicioRepository } from '../domain/repositories/servicioRepository';
import { Reparacion, CreateReparacion, UpdateReparacion, EstadoReparacion } from '../domain/entities/reparacion';
import { ReparacionServicio } from '../domain/entities/reparacionServicio';
import { PaginatedResult } from '../domain/types/pagination';
import { ConflictError, NotFoundError } from '../infrastructure/http/errors';

export class ReparacionService {
  constructor(
    private readonly reparacionRepository: ReparacionRepository,
    private readonly reparacionServicioRepository: ReparacionServicioRepository,
    private readonly servicioRepository: ServicioRepository,
  ) {}

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
    const reparacion = await this.reparacionRepository.getById(id);
    if (!reparacion) throw new NotFoundError('Reparación');
    if (reparacion.estado === EstadoReparacion.TERMINADO || reparacion.estado === EstadoReparacion.ENTREGADO) {
      throw new ConflictError(
        reparacion.estado === EstadoReparacion.TERMINADO
          ? 'No se puede eliminar una reparación ya terminada'
          : 'No se puede eliminar una reparación ya entregada',
      );
    }
    const facturas = await this.reparacionRepository.countFacturas(id);
    if (facturas > 0) {
      throw new ConflictError('No se puede eliminar: la reparación tiene facturas asociadas');
    }
    return this.reparacionRepository.delete(id);
  }

  async cambiarEstadoReparacion(id: number, nuevoEstado: string): Promise<Reparacion | null> {
    const reparacion = await this.reparacionRepository.getById(id);
    if (!reparacion) throw new NotFoundError('Reparación');

    if (nuevoEstado === EstadoReparacion.ENTREGADO) {
      const facturas = await this.reparacionRepository.countFacturas(id);
      if (facturas === 0) {
        throw new ConflictError('No se puede entregar: la reparación no tiene factura');
      }
    }

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

  async getServicios(reparacionId: number): Promise<ReparacionServicio[]> {
    return this.reparacionServicioRepository.getByReparacion(reparacionId);
  }

  async addServicio(reparacionId: number, servicioId: number, cantidad: number): Promise<ReparacionServicio[]> {
    const reparacion = await this.reparacionRepository.getById(reparacionId);
    if (!reparacion) throw new NotFoundError('Reparación');
    const servicio = await this.servicioRepository.getById(servicioId);
    if (!servicio) throw new NotFoundError('Servicio');

    const existing = await this.reparacionServicioRepository.getByReparacionAndServicio(reparacionId, servicioId);
    if (existing) {
      await this.reparacionServicioRepository.updateCantidad(
        existing.id,
        existing.cantidad + cantidad,
        servicio.precioBase,
      );
    } else {
      await this.reparacionServicioRepository.create({
        reparacionId,
        servicioId,
        cantidad,
        precioUnitario: servicio.precioBase,
      });
    }
    await this.recalcularManoObra(reparacionId);
    return this.reparacionServicioRepository.getByReparacion(reparacionId);
  }

  async setServicioCantidad(reparacionId: number, servicioId: number, cantidad: number): Promise<ReparacionServicio[]> {
    const existing = await this.reparacionServicioRepository.getByReparacionAndServicio(reparacionId, servicioId);
    if (!existing) throw new NotFoundError('Servicio de la reparación');
    await this.reparacionServicioRepository.updateCantidad(existing.id, cantidad, existing.precioUnitario);
    await this.recalcularManoObra(reparacionId);
    return this.reparacionServicioRepository.getByReparacion(reparacionId);
  }

  async removeServicio(reparacionId: number, servicioId: number): Promise<ReparacionServicio[]> {
    await this.reparacionServicioRepository.delete(reparacionId, servicioId);
    await this.recalcularManoObra(reparacionId);
    return this.reparacionServicioRepository.getByReparacion(reparacionId);
  }

  private async recalcularManoObra(reparacionId: number): Promise<void> {
    const total = await this.reparacionServicioRepository.sumByReparacion(reparacionId);
    await this.reparacionRepository.update(reparacionId, { costoManoObra: total });
  }
}
