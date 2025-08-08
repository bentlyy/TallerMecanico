// src/domain/repositories/facturaRepository.ts
import { Factura, CreateFactura} from "../entities/factura";

export interface FacturaRepository {
  getAll(): Promise<Factura[]>;
  getById(id: number): Promise<Factura | null>;
  create(data: CreateFactura): Promise<Factura>;
  getByCliente(clienteId: number): Promise<Factura[]>;
  getByReparacion(reparacionId: number): Promise<Factura | null>;
}