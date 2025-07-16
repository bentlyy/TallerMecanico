//clienteService.ts
import { ClienteRepository } from '../domain/repositories/clienteRepository';
import { Cliente, CreateCliente, UpdateCliente } from '../domain/entities/cliente';

export class ClienteService {
  constructor(private readonly clienteRepository: ClienteRepository) {}

  async getAllClientes(): Promise<Cliente[]> {
    return this.clienteRepository.getAll();
  }

  async getClienteById(id: number): Promise<Cliente | null> {
    return this.clienteRepository.getById(id);
  }

  async getClienteByEmail(email: string): Promise<Cliente | null> {
    return this.clienteRepository.getByEmail(email);
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