import { PrismaClient } from '@prisma/client';
import { RolRepository } from '../../domain/repositories/rolRepository';
import { Rol, CreateRol, UpdateRol } from '../../domain/entities/rol';

export class PrismaRolRepository implements RolRepository {
  constructor(private prisma: PrismaClient) {}

  async getAll(): Promise<Rol[]> {
    const roles = await this.prisma.rol.findMany();
    return roles.map(rol => new Rol(
      rol.id,
      rol.nombre,
      rol.permisos as Record<string, boolean>
    ));
  }

  async getById(id: number): Promise<Rol | null> {
    const rol = await this.prisma.rol.findUnique({ where: { id } });
    return rol ? new Rol(
      rol.id,
      rol.nombre,
      rol.permisos as Record<string, boolean>
    ) : null;
  }

  async getByNombre(nombre: string): Promise<Rol | null> {
    const rol = await this.prisma.rol.findUnique({ where: { nombre } });
    return rol ? new Rol(
      rol.id,
      rol.nombre,
      rol.permisos as Record<string, boolean>
    ) : null;
  }

  async create(data: CreateRol): Promise<Rol> {
    const rol = await this.prisma.rol.create({ 
      data: {
        nombre: data.nombre,
        permisos: data.permisos
      }
    });
    return new Rol(
      rol.id,
      rol.nombre,
      rol.permisos as Record<string, boolean>
    );
  }

  async update(id: number, data: UpdateRol): Promise<Rol | null> {
    const rol = await this.prisma.rol.update({
      where: { id },
      data
    });
    return rol ? new Rol(
      rol.id,
      rol.nombre,
      rol.permisos as Record<string, boolean>
    ) : null;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.rol.delete({ where: { id } });
  }
}