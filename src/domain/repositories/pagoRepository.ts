import { Pago, CreatePago } from '../entities/pago';

export interface PagoRepository {
  getByFactura(facturaId: number): Promise<Pago[]>;
  getById(id: number): Promise<Pago | null>;
  create(data: CreatePago): Promise<Pago>;
  delete(id: number): Promise<void>;
  sumByFactura(facturaId: number): Promise<number>;
}
