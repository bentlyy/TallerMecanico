import { Cliente, CreateClienteDto } from "../entities/cliente";

export interface ClienteRepository {
  create(cliente: CreateClienteDto): Promise<Cliente>;
  findById(id: number): Promise<Cliente | null>;
  findAll(): Promise<Cliente[]>;
  update(id: number, changes: Partial<Cliente>): Promise<Cliente>;
  delete(id: number): Promise<void>;
}