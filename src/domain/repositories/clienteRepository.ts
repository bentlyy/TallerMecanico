//clienteRepository.ts
import { Cliente, CreateCliente, UpdateCliente } from "../entities/cliente";

export interface ClienteRepository {
  getAll(): Promise<Cliente[]>;
  getById(id: number): Promise<Cliente | null>;
  getByEmail(email: string): Promise<Cliente | null>;
  create(data: CreateCliente): Promise<Cliente>;
  update(id: number, data: UpdateCliente): Promise<Cliente | null>;
  delete(id: number): Promise<void>;
}