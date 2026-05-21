import { FacturaRepository } from '../domain/repositories/facturaRepository';
import { CreateFactura, Factura } from '../domain/entities/factura';
import { PaginatedResult } from '../domain/types/pagination';

export class FacturaService {
  constructor(private readonly repository: FacturaRepository) {}

  async getAllFacturas(page = 1, limit = 20): Promise<PaginatedResult<Factura>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([this.repository.getAll(skip, limit), this.repository.count()]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getFacturaById(id: number): Promise<Factura | null> {
    return this.repository.getById(id);
  }

  async createFactura(data: CreateFactura): Promise<Factura> {
    return this.repository.create(data);
  }

  async getFacturasPorCliente(clienteId: number): Promise<Factura[]> {
    return this.repository.getByCliente(clienteId);
  }

  async getFacturasPorReparacion(reparacionId: number): Promise<Factura | null> {
    return this.repository.getByReparacion(reparacionId);
  }
}
