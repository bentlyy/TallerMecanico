import { PrismaClient } from '@prisma/client';
import { ClienteRepository } from '../../domain/repositories/clienteRepository';
import { Cliente, CreateClienteDto } from '../../domain/entities/cliente';

export class PrismaClienteRepository implements ClienteRepository {
  private prisma = new PrismaClient();

  async create(cliente: CreateClienteDto): Promise<Cliente> {
    const created = await this.prisma.clientes.create({ 
      data: cliente 
    });
    return this.mapToDomain(created);
  }

  async findById(id: number): Promise<Cliente | null> {
    const cliente = await this.prisma.clientes.findUnique({
      where: { id }
    });
    return cliente ? this.mapToDomain(cliente) : null;
  }

  async findAll(): Promise<Cliente[]> {
    const clientes = await this.prisma.clientes.findMany();
    return clientes.map(this.mapToDomain);
  }

  async update(id: number, changes: Partial<Cliente>): Promise<Cliente> {
    const updated = await this.prisma.clientes.update({
      where: { id },
      data: changes
    });
    return this.mapToDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.clientes.delete({
      where: { id }
    });
  }

  // Método auxiliar para mapear el modelo de Prisma a tu dominio
  private mapToDomain(cliente: any): Cliente {
    return {
      id: cliente.id,
      nombre: cliente.nombre,
      email: cliente.email,
      telefono: cliente.telefono,
      direccion: cliente.direccion
    };
  }
}