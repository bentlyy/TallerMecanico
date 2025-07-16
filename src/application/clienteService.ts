import { ClienteRepository } from "../domain/repositories/clienteRepository";
import { Cliente } from "../domain/entities/cliente";

export class ClienteService {
  constructor(private clienteRepository: ClienteRepository) {}

  async listarClientes(): Promise<Cliente[]> {
    return this.clienteRepository.getAll();
  }

  async obtenerCliente(id: number): Promise<Cliente | null> {
    return this.clienteRepository.getById(id);
  }

  async crearCliente(data: Omit<Cliente, "id">): Promise<Cliente> {
    return this.clienteRepository.create(data);
  }

  async actualizarCliente(id: number, data: Partial<Omit<Cliente, "id">>): Promise<Cliente | null> {
    return this.clienteRepository.update(id, data);
  }

  async eliminarCliente(id: number): Promise<void> {
    return this.clienteRepository.delete(id);
  }
}
