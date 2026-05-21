import { ClienteRepository } from '../domain/repositories/clienteRepository';
import { Cliente, CreateCliente, UpdateCliente } from '../domain/entities/cliente';
import { PaginatedResult } from '../domain/types/pagination';

export class ClienteService {
  constructor(private readonly clienteRepository: ClienteRepository) {}

  async getAllClientes(empresaId: number, page = 1, limit = 20): Promise<PaginatedResult<Cliente>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.clienteRepository.getAll(empresaId, skip, limit),
      this.clienteRepository.count(empresaId),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getClienteById(id: number): Promise<Cliente | null> {
    return this.clienteRepository.getById(id);
  }

  async getClienteByEmail(email: string, empresaId: number): Promise<Cliente | null> {
    return this.clienteRepository.getByEmail(email, empresaId);
  }

  async createCliente(data: CreateCliente): Promise<Cliente> {
    return this.clienteRepository.create(data);
  }

  async updateCliente(id: number, data: UpdateCliente): Promise<Cliente | null> {
    return this.clienteRepository.update(id, data);
  }

  async deleteCliente(id: number): Promise<void> {
    return this.clienteRepository.delete(id);
  }
}
