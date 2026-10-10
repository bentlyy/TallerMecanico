import { ServicioRepository } from '../domain/repositories/servicioRepository';
import { Servicio, CreateServicio, UpdateServicio } from '../domain/entities/servicio';
import { PaginatedResult } from '../domain/types/pagination';
import { ConflictError } from '../infrastructure/http/errors';

export class ServicioService {
  constructor(private readonly servicioRepository: ServicioRepository) {}

  async getAllServicios(empresaId: number, page = 1, limit = 100): Promise<PaginatedResult<Servicio>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.servicioRepository.getAll(empresaId, skip, limit),
      this.servicioRepository.count(empresaId),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getServicioById(id: number): Promise<Servicio | null> {
    return this.servicioRepository.getById(id);
  }

  async createServicio(data: CreateServicio): Promise<Servicio> {
    const existing = await this.servicioRepository.getByNombre(data.nombre, data.empresaId);
    if (existing) throw new ConflictError('Ya existe un servicio con este nombre');
    return this.servicioRepository.create(data);
  }

  async updateServicio(id: number, data: UpdateServicio, empresaId: number): Promise<Servicio | null> {
    if (data.nombre) {
      const existing = await this.servicioRepository.getByNombre(data.nombre, empresaId);
      if (existing && existing.id !== id) throw new ConflictError('Ya existe otro servicio con este nombre');
    }
    return this.servicioRepository.update(id, data);
  }

  async deleteServicio(id: number): Promise<void> {
    return this.servicioRepository.delete(id);
  }
}
