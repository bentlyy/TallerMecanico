import { Cliente, CreateCliente, UpdateCliente } from '../entities/cliente';

export interface ClienteRepository {
  getAll(empresaId?: number, skip?: number, limit?: number): Promise<Cliente[]>;
  count(empresaId?: number): Promise<number>;
  getById(id: number): Promise<Cliente | null>;
  getByEmail(email: string, empresaId: number): Promise<Cliente | null>;
  create(data: CreateCliente): Promise<Cliente>;
  update(id: number, data: UpdateCliente): Promise<Cliente | null>;
  delete(id: number): Promise<void>;
}
