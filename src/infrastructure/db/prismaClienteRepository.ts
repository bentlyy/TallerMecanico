//prismaClienteRepository.ts
import { PrismaClient } from '@prisma/client';
import { ClienteRepository } from '../../domain/repositories/clienteRepository';
import { Cliente, CreateCliente, UpdateCliente } from '../../domain/entities/cliente';

export class PrismaClienteRepository implements ClienteRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll(): Promise<Cliente[]> {
    const clientes = await this.prisma.cliente.findMany();
    return clientes.map((cliente: any) => 
      new Cliente(
        cliente.id,
        cliente.nombre,
        cliente.email,
        cliente.telefono,
        cliente.direccion
      )
    );
  }

  async getById(id: number): Promise<Cliente | null> {
    const cliente = await this.prisma.cliente.findUnique({ where: { id } });
    return cliente ? new Cliente(
      cliente.id,
      cliente.nombre,
      cliente.email,
      cliente.telefono,
      cliente.direccion
    ) : null;
  }

  async getByEmail(email: string): Promise<Cliente | null> {
    const cliente = await this.prisma.cliente.findUnique({ where: { email } });
    return cliente ? new Cliente(
      cliente.id,
      cliente.nombre,
      cliente.email,
      cliente.telefono,
      cliente.direccion
    ) : null;
  }

  async create(data: CreateCliente): Promise<Cliente> {
    const cliente = await this.prisma.cliente.create({ data });
    return new Cliente(
      cliente.id,
      cliente.nombre,
      cliente.email,
      cliente.telefono,
      cliente.direccion
    );
  }

  async update(id: number, data: UpdateCliente): Promise<Cliente | null> {
    const cliente = await this.prisma.cliente.update({
      where: { id },
      data
    });
    return cliente ? new Cliente(
      cliente.id,
      cliente.nombre,
      cliente.email,
      cliente.telefono,
      cliente.direccion
    ) : null;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.cliente.delete({ where: { id } });
  }
}