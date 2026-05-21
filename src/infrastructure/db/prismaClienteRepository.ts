import { PrismaClient } from '@prisma/client';
import { ClienteRepository } from '../../domain/repositories/clienteRepository';
import { Cliente, CreateCliente, UpdateCliente } from '../../domain/entities/cliente';

function mapCliente(c: any): Cliente {
  return new Cliente(c.id, c.nombre, c.email, c.telefono, c.direccion, c.empresaId);
}

export class PrismaClienteRepository implements ClienteRepository {
  constructor(private prisma: PrismaClient) {}

  async getAll(empresaId?: number, skip?: number, limit?: number): Promise<Cliente[]> {
    const where = empresaId !== undefined ? { empresaId } : {};
    const clientes = await this.prisma.cliente.findMany({ where, skip, take: limit });
    return clientes.map(mapCliente);
  }

  async count(empresaId?: number): Promise<number> {
    const where = empresaId !== undefined ? { empresaId } : {};
    return this.prisma.cliente.count({ where });
  }

  async getById(id: number): Promise<Cliente | null> {
    const cliente = await this.prisma.cliente.findUnique({ where: { id } });
    return cliente ? mapCliente(cliente) : null;
  }

  async getByEmail(email: string, empresaId: number): Promise<Cliente | null> {
    const cliente = await this.prisma.cliente.findUnique({
      where: { email_empresaId: { email, empresaId } },
    });
    return cliente ? mapCliente(cliente) : null;
  }

  async create(data: CreateCliente): Promise<Cliente> {
    const cliente = await this.prisma.cliente.create({ data });
    return mapCliente(cliente);
  }

  async update(id: number, data: UpdateCliente): Promise<Cliente | null> {
    const cliente = await this.prisma.cliente.update({ where: { id }, data });
    return cliente ? mapCliente(cliente) : null;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.cliente.delete({ where: { id } });
  }
}
