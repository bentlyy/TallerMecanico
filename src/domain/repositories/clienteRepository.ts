import { Cliente } from "../entities/cliente";

export interface ClienteRepository {
  getAll(): Promise<Cliente[]>;
  getById(id: number): Promise<Cliente | null>;
  create(cliente: Omit<Cliente, "id">): Promise<Cliente>;
  update(id: number, cliente: Partial<Omit<Cliente, "id">>): Promise<Cliente | null>;
  delete(id: number): Promise<void>;
}
