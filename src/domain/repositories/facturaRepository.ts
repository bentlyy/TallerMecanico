import { Factura } from "../entities/factura";

export interface FacturaRepository {
  getAll(): Promise<Factura[]>;
  getById(id: number): Promise<Factura | null>;
  create(data: Omit<Factura, "id" | "fecha">): Promise<Factura>;
}
