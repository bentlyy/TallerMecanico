import { UsuarioRepository } from "../../domain/repositories/usuarioRepository";
import { Usuario } from "../../domain/entities/usuario";
import { prisma } from './prisma';

export class PrismaUsuarioRepository implements UsuarioRepository {
  async getAll(): Promise<Usuario[]> {
    const usuarios = await prisma.usuario.findMany();
    return usuarios.map(u =>
      new Usuario(u.id, u.email, u.password_hash, u.nombre, u.activo, u.rol_id)
    );
  }

  async getById(id: number): Promise<Usuario | null> {
    const u = await prisma.usuario.findUnique({ where: { id } });
    return u ? new Usuario(u.id, u.email, u.password_hash, u.nombre, u.activo, u.rol_id) : null;
  }

  async getByEmail(email: string): Promise<Usuario | null> {
    const u = await prisma.usuario.findUnique({ where: { email } });
    return u ? new Usuario(u.id, u.email, u.password_hash, u.nombre, u.activo, u.rol_id) : null;
  }

  async create(data: Omit<Usuario, "id">): Promise<Usuario> {
    const u = await prisma.usuario.create({
      data: {
        email: data.email,
        password_hash: data.password_hash,
        nombre: data.nombre,
        activo: data.activo,
        rol: {
          connect: { id: data.rol_id }, // importante para relaciones
        },
      },
    });
    return new Usuario(u.id, u.email, u.password_hash, u.nombre, u.activo, u.rol_id);
  }

  async update(id: number, data: Partial<Omit<Usuario, "id">>): Promise<Usuario | null> {
    const updateData: any = {
      email: data.email,
      password_hash: data.password_hash,
      nombre: data.nombre,
      activo: data.activo,
    };

    if (data.rol_id !== undefined) {
      updateData.rol = { connect: { id: data.rol_id } };
    }

    const u = await prisma.usuario.update({
      where: { id },
      data: updateData,
    });

    return new Usuario(u.id, u.email, u.password_hash, u.nombre, u.activo, u.rol_id);
  }

  async delete(id: number): Promise<void> {
    await prisma.usuario.delete({ where: { id } });
  }
}
