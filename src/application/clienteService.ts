import { ClienteRepository } from '../domain/repositories/clienteRepository';
import { Cliente, CreateClienteDto } from '../domain/entities/cliente';

export class ClienteService {
  constructor(private readonly clienteRepository: ClienteRepository) {}

  async crearCliente(cliente: CreateClienteDto): Promise<Cliente> {
    // Puedes añadir lógica de negocio aquí
    return this.clienteRepository.create(cliente);
  }
  // Otros casos de uso...
}