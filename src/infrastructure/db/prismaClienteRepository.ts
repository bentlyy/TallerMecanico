import { ClienteRepository } from "../../domain/repositories/clienteRepository";
import { Cliente } from "../../domain/entities/cliente";
import { prisma } from './prisma'; // ✅ Correcto

export class PrismaClienteRepository implements ClienteRepository {
  async getAll(): Promise<Cliente[]> {
    const clientes = await prisma.cliente.findMany();
    return clientes.map(c => new Cliente(c.id, c.nombre, c.email ?? undefined, c.telefono ?? undefined, c.direccion ?? undefined));
  }

  async getById(id: number): Promise<Cliente | null> {
    const c = await prisma.cliente.findUnique({ where: { id } });
    return c ? new Cliente(c.id, c.nombre, c.email ?? undefined, c.telefono ?? undefined, c.direccion ?? undefined) : null;
  }

  async create(data: Omit<Cliente, "id">): Promise<Cliente> {
    const c = await prisma.cliente.create({ data });
    return new Cliente(c.id, c.nombre, c.email ?? undefined, c.telefono ?? undefined, c.direccion ?? undefined);
  }

  async update(id: number, data: Partial<Omit<Cliente, "id">>): Promise<Cliente | null> {
    const c = await prisma.cliente.update({ where: { id }, data });
    return new Cliente(c.id, c.nombre, c.email ?? undefined, c.telefono ?? undefined, c.direccion ?? undefined);
  }

  async delete(id: number): Promise<void> {
    await prisma.cliente.delete({ where: { id } });
  }
}
