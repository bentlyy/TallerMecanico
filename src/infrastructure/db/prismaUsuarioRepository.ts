import { PrismaClient } from '@prisma/client';
import { UsuarioRepository } from '../../domain/repositories/usuarioRepository';
import { Usuario, CreateUsuario, UpdateUsuario } from '../../domain/entities/usuario';

export class PrismaUsuarioRepository implements UsuarioRepository {
  constructor(private prisma: PrismaClient) {}

  async getAll(): Promise<Usuario[]> {
    const usuarios = await this.prisma.usuario.findMany();
    return usuarios.map(u => new Usuario(
      u.id,
      u.email,
      u.passwordHash,
      u.nombre,
      u.activo,
      u.rolId
    ));
  }

  async getById(id: number): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    return usuario ? new Usuario(
      usuario.id,
      usuario.email,
      usuario.passwordHash,
      usuario.nombre,
      usuario.activo,
      usuario.rolId
    ) : null;
  }

  async getByEmail(email: string): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findUnique({ where: { email } });
    return usuario ? new Usuario(
      usuario.id,
      usuario.email,
      usuario.passwordHash,
      usuario.nombre,
      usuario.activo,
      usuario.rolId
    ) : null;
  }

  async create(data: CreateUsuario): Promise<Usuario> {
    const usuario = await this.prisma.usuario.create({ 
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        nombre: data.nombre,
        activo: data.activo,
        rolId: data.rolId
      }
    });
    return new Usuario(
      usuario.id,
      usuario.email,
      usuario.passwordHash,
      usuario.nombre,
      usuario.activo,
      usuario.rolId
    );
  }

  async update(id: number, data: UpdateUsuario): Promise<Usuario | null> {
    const updateData: any = {
      nombre: data.nombre,
      activo: data.activo,
      rolId: data.rolId
    };

    if (data.password) {
      updateData.passwordHash = data.password; // En la práctica, deberías hashear la contraseña aquí
    }

    const usuario = await this.prisma.usuario.update({
      where: { id },
      data: updateData
    });
    return usuario ? new Usuario(
      usuario.id,
      usuario.email,
      usuario.passwordHash,
      usuario.nombre,
      usuario.activo,
      usuario.rolId
    ) : null;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.usuario.delete({ where: { id } });
  }

  async activate(id: number): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.update({
      where: { id },
      data: { activo: true }
    });
    return usuario ? new Usuario(
      usuario.id,
      usuario.email,
      usuario.passwordHash,
      usuario.nombre,
      usuario.activo,
      usuario.rolId
    ) : null;
  }

  async deactivate(id: number): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.update({
      where: { id },
      data: { activo: false }
    });
    return usuario ? new Usuario(
      usuario.id,
      usuario.email,
      usuario.passwordHash,
      usuario.nombre,
      usuario.activo,
      usuario.rolId
    ) : null;
  }
}