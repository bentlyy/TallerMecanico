import { MecanicoRepository } from "../../domain/repositories/mecanicoRepository";
import { Mecanico } from "../../domain/entities/mecanico";
import { prisma } from './prisma';

export class PrismaMecanicoRepository implements MecanicoRepository {
  async getAll(): Promise<Mecanico[]> {
    const mecanicos = await prisma.mecanico.findMany();
    return mecanicos.map(m => new Mecanico(m.id, m.usuario_id, m.especialidad ?? null));
  }

  async getById(id: number): Promise<Mecanico | null> {
    const m = await prisma.mecanico.findUnique({ where: { id } });
    return m ? new Mecanico(m.id, m.usuario_id, m.especialidad ?? null) : null;
  }

  async getByUsuarioId(usuarioId: number): Promise<Mecanico | null> {
    const m = await prisma.mecanico.findUnique({ where: { usuario_id: usuarioId } });
    return m ? new Mecanico(m.id, m.usuario_id, m.especialidad ?? null) : null;
  }

  async create(data: Omit<Mecanico, "id">): Promise<Mecanico> {
  const m = await prisma.mecanico.create({
    data: {
      usuario: { connect: { id: data.usuario_id } },
      especialidad: data.especialidad ?? undefined,
    },
  });

  return new Mecanico(m.id, m.usuario_id, m.especialidad ?? null);
  }

  async update(id: number, data: Partial<Omit<Mecanico, "id">>): Promise<Mecanico | null> {
    const m = await prisma.mecanico.update({ where: { id }, data });
    return new Mecanico(m.id, m.usuario_id, m.especialidad ?? null);
  }

  async delete(id: number): Promise<void> {
    await prisma.mecanico.delete({ where: { id } });
  }
}
