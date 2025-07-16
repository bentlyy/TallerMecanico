import { RolRepository } from "../../domain/repositories/rolRepository";
import { Rol } from "../../domain/entities/rol";
import { prisma } from './prisma';

export class PrismaRolRepository implements RolRepository {
  async getAll(): Promise<Rol[]> {
    const roles = await prisma.rol.findMany();
    return roles.map(r => new Rol(r.id, r.nombre, r.permisos));
  }

  async getById(id: number): Promise<Rol | null> {
    const r = await prisma.rol.findUnique({ where: { id } });
    return r ? new Rol(r.id, r.nombre, r.permisos) : null;
  }

  async getByNombre(nombre: string): Promise<Rol | null> {
    const r = await prisma.rol.findUnique({ where: { nombre } });
    return r ? new Rol(r.id, r.nombre, r.permisos) : null;
  }

  async create(data: Omit<Rol, "id">): Promise<Rol> {
    const r = await prisma.rol.create({ data });
    return new Rol(r.id, r.nombre, r.permisos);
  }

  async update(id: number, data: Partial<Omit<Rol, "id">>): Promise<Rol | null> {
    const r = await prisma.rol.update({ where: { id }, data });
    return new Rol(r.id, r.nombre, r.permisos);
  }

  async delete(id: number): Promise<void> {
    await prisma.rol.delete({ where: { id } });
  }
}
