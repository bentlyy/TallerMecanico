import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { UsuarioRepository } from '../../domain/repositories/usuarioRepository';
import { Usuario, CreateUsuario, UpdateUsuario } from '../../domain/entities/usuario';

function mapUsuario(u: any): Usuario {
  return new Usuario(
    u.id,
    u.email,
    u.passwordHash,
    u.nombre,
    u.activo,
    u.rolId,
    u.empresaId,
    u.loginAttempts,
    u.lockedUntil,
  );
}

export class PrismaUsuarioRepository implements UsuarioRepository {
  constructor(private prisma: PrismaClient) {}

  async getAll(empresaId?: number, skip?: number, limit?: number): Promise<Usuario[]> {
    const where = empresaId !== undefined ? { empresaId } : {};
    const usuarios = await this.prisma.usuario.findMany({ where, skip, take: limit });
    return usuarios.map(mapUsuario);
  }

  async count(empresaId?: number): Promise<number> {
    const where = empresaId !== undefined ? { empresaId } : {};
    return this.prisma.usuario.count({ where });
  }

  async getById(id: number): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    return usuario ? mapUsuario(usuario) : null;
  }

  async getByEmail(email: string, empresaId: number): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email_empresaId: { email, empresaId } },
    });
    return usuario ? mapUsuario(usuario) : null;
  }

  async create(data: CreateUsuario): Promise<Usuario> {
    const passwordHash = await bcrypt.hash(data.passwordHash, 10);
    const usuario = await this.prisma.usuario.create({
      data: {
        email: data.email,
        passwordHash,
        nombre: data.nombre,
        activo: data.activo,
        rolId: data.rolId,
        empresaId: data.empresaId,
      },
    });
    return mapUsuario(usuario);
  }

  async update(id: number, data: UpdateUsuario): Promise<Usuario | null> {
    const updateData: any = {};
    if (data.nombre !== undefined) updateData.nombre = data.nombre;
    if (data.activo !== undefined) updateData.activo = data.activo;
    if (data.rolId !== undefined) updateData.rolId = data.rolId;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }
    const usuario = await this.prisma.usuario.update({ where: { id }, data: updateData });
    return mapUsuario(usuario);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.usuario.delete({ where: { id } });
  }

  async activate(id: number): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.update({ where: { id }, data: { activo: true } });
    return mapUsuario(usuario);
  }

  async deactivate(id: number): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.update({ where: { id }, data: { activo: false } });
    return mapUsuario(usuario);
  }
}
