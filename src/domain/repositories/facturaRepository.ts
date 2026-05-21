import { Factura, CreateFactura } from '../entities/factura';

export interface FacturaRepository {
  getAll(skip?: number, limit?: number): Promise<Factura[]>;
  count(): Promise<number>;
  getById(id: number): Promise<Factura | null>;
  create(data: CreateFactura): Promise<Factura>;
  getByCliente(clienteId: number): Promise<Factura[]>;
  getByReparacion(reparacionId: number): Promise<Factura | null>;
}
