import { PrismaClient } from '@prisma/client';
import { MecanicoRepository } from '../../domain/repositories/mecanicoRepository';
import { Mecanico, CreateMecanico, UpdateMecanico } from '../../domain/entities/mecanico';

export class PrismaMecanicoRepository implements MecanicoRepository {
  constructor(private prisma: PrismaClient) {}

  async getAll(): Promise<Mecanico[]> {
    const mecanicos = await this.prisma.mecanico.findMany();
    return mecanicos.map(m => new Mecanico(
      m.id,
      m.usuarioId,
      m.especialidad
    ));
  }

  async getById(id: number): Promise<Mecanico | null> {
    const mecanico = await this.prisma.mecanico.findUnique({ where: { id } });
    return mecanico ? new Mecanico(
      mecanico.id,
      mecanico.usuarioId,
      mecanico.especialidad
    ) : null;
  }

  async getByUsuarioId(usuarioId: number): Promise<Mecanico | null> {
    const mecanico = await this.prisma.mecanico.findUnique({ 
      where: { usuarioId } 
    });
    return mecanico ? new Mecanico(
      mecanico.id,
      mecanico.usuarioId,
      mecanico.especialidad
    ) : null;
  }

  async create(data: CreateMecanico): Promise<Mecanico> {
    const mecanico = await this.prisma.mecanico.create({ data });
    return new Mecanico(
      mecanico.id,
      mecanico.usuarioId,
      mecanico.especialidad
    );
  }

  async update(id: number, data: UpdateMecanico): Promise<Mecanico | null> {
    const mecanico = await this.prisma.mecanico.update({
      where: { id },
      data
    });
    return mecanico ? new Mecanico(
      mecanico.id,
      mecanico.usuarioId,
      mecanico.especialidad
    ) : null;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.mecanico.delete({ where: { id } });
  }
}