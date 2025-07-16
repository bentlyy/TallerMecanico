import { PrismaClient } from '@prisma/client';
import { RolRepository } from '../../domain/repositories/rolRepository';
import { Rol, CreateRol, UpdateRol, Permisos } from '../../domain/entities/rol';

export class PrismaRolRepository implements RolRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToEntity(rol: any): Rol {
    return new Rol(
      rol.id,
      rol.nombre,
      rol.permisos as Permisos
    );
  }

  async getAll(): Promise<Rol[]> {
    const roles = await this.prisma.rol.findMany();
    return roles.map(this.mapToEntity);
  }

  async getById(id: number): Promise<Rol | null> {
    const rol = await this.prisma.rol.findUnique({ where: { id } });
    return rol ? this.mapToEntity(rol) : null;
  }

  async create(data: CreateRol): Promise<Rol> {
    const rol = await this.prisma.rol.create({ data });
    return this.mapToEntity(rol);
  }

  async update(id: number, data: UpdateRol): Promise<Rol | null> {
    const rol = await this.prisma.rol.update({
      where: { id },
      data
    });
    return this.mapToEntity(rol);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.rol.delete({ where: { id } });
  }

  async getPermisos(id: number): Promise<Permisos | null> {
    const rol = await this.prisma.rol.findUnique({
      where: { id },
      select: { permisos: true }
    });
    return rol ? rol.permisos as Permisos : null;
  }
}