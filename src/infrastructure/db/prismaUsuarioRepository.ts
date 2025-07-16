import { PrismaClient } from '@prisma/client';
import { UsuarioRepository } from '../../domain/repositories/usuarioRepository';
import { Usuario, CreateUsuario, UpdateUsuario, AuthCredentials } from '../../domain/entities/usuario';
import { Reparacion } from '../../domain/entities/reparacion';
import bcrypt from 'bcrypt';

export class PrismaUsuarioRepository implements UsuarioRepository {
  constructor(private prisma: PrismaClient) {}

  async getAll(): Promise<Usuario[]> {
    const usuarios = await this.prisma.usuario.findMany();
    return usuarios.map(this.mapToEntity);
  }

  async getById(id: number): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    return usuario ? this.mapToEntity(usuario) : null;
  }

  async getByEmail(email: string): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findUnique({ where: { email } });
    return usuario ? this.mapToEntity(usuario) : null;
  }

  async create(data: CreateUsuario): Promise<Usuario> {
    const hashedPassword = await bcrypt.hash(data.passwordHash, 10);
    const usuario = await this.prisma.usuario.create({ 
      data: {
        ...data,
        passwordHash: hashedPassword,
        rol: { connect: { id: data.rolId } }
      }
    });
    return this.mapToEntity(usuario);
  }

  async update(id: number, data: UpdateUsuario): Promise<Usuario | null> {
    const updateData: any = { ...data };
    
    if (data.passwordHash) {
      updateData.passwordHash = await bcrypt.hash(data.passwordHash, 10);
    }
    
    if (data.rolId) {
      updateData.rol = { connect: { id: data.rolId } };
      delete updateData.rolId;
    }

    const usuario = await this.prisma.usuario.update({
      where: { id },
      data: updateData
    });
    return this.mapToEntity(usuario);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.usuario.delete({ where: { id } });
  }

  async activate(id: number): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.update({
      where: { id },
      data: { activo: true }
    });
    return this.mapToEntity(usuario);
  }

  async deactivate(id: number): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.update({
      where: { id },
      data: { activo: false }
    });
    return this.mapToEntity(usuario);
  }

  async getByRol(rolId: number): Promise<Usuario[]> {
    const usuarios = await this.prisma.usuario.findMany({ 
      where: { rolId } 
    });
    return usuarios.map(this.mapToEntity);
  }

  async getReparacionesAsRecepcionista(usuarioId: number): Promise<Reparacion[]> {
    const reparaciones = await this.prisma.reparacion.findMany({
      where: { recepcionistaId: usuarioId },
      include: {
        vehiculo: true,
        mecanico: { include: { usuario: true } }
      }
    });

    return reparaciones.map(r => new Reparacion(
      r.id,
      r.descripcion,
      r.fechaEntrada,
      r.fechaSalida,
      r.estado,
      r.costoManoObra,
      r.vehiculoId,
      r.mecanicoId,
      r.recepcionistaId
    ));
  }

  async authenticate(credentials: AuthCredentials): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findUnique({ 
      where: { email: credentials.email } 
    });
    
    if (!usuario || !usuario.activo) return null;
    
    const isValid = await bcrypt.compare(credentials.password, usuario.passwordHash);
    return isValid ? this.mapToEntity(usuario) : null;
  }

  private mapToEntity(usuario: any): Usuario {
    return new Usuario(
      usuario.id,
      usuario.email,
      usuario.passwordHash,
      usuario.nombre,
      usuario.activo,
      usuario.rolId
    );
  }
}