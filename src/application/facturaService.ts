import { FacturaRepository } from '../domain/repositories/facturaRepository';
import { Factura } from '../domain/entities/factura';

export class FacturaService {
  constructor(private readonly repository: FacturaRepository) {}

  async getAllFacturas(): Promise<Factura[]> {
    return this.repository.getAll();
  }

  async getFacturaById(id: number): Promise<Factura | null> {
    return this.repository.getById(id);
  }

  async createFactura(data: Factura): Promise<Factura> {
    return this.repository.create(data);
  }

  async getFacturasPorCliente(clienteId: number): Promise<Factura[]> {
    return this.repository.getByCliente(clienteId);
  }

  async getFacturasPorReparacion(reparacionId: number): Promise<Factura | null> {
    return this.repository.getByReparacion(reparacionId);
  }
}