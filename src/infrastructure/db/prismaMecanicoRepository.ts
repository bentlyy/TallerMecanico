import { PrismaClient } from '@prisma/client';
import { MecanicoRepository } from '../../domain/repositories/mecanicoRepository';
import { Mecanico, CreateMecanico, UpdateMecanico } from '../../domain/entities/mecanico';

const usuarioInclude = { usuario: { select: { id: true, email: true, nombre: true, rolId: true } } };

function mapMecanico(m: any): Mecanico {
  return new Mecanico(m.id, m.usuarioId, m.especialidad, m.usuario ?? undefined);
}

export class PrismaMecanicoRepository implements MecanicoRepository {
  constructor(private prisma: PrismaClient) {}

  async getAll(skip?: number, limit?: number): Promise<Mecanico[]> {
    const mecanicos = await this.prisma.mecanico.findMany({
      skip,
      take: limit,
      include: usuarioInclude,
      orderBy: { id: 'asc' },
    });
    return mecanicos.map(mapMecanico);
  }

  async count(): Promise<number> {
    return this.prisma.mecanico.count();
  }

  async getById(id: number): Promise<Mecanico | null> {
    const mecanico = await this.prisma.mecanico.findUnique({ where: { id }, include: usuarioInclude });
    return mecanico ? mapMecanico(mecanico) : null;
  }

  async getByUsuarioId(usuarioId: number): Promise<Mecanico | null> {
    const mecanico = await this.prisma.mecanico.findUnique({ where: { usuarioId } });
    return mecanico ? mapMecanico(mecanico) : null;
  }

  async create(data: CreateMecanico): Promise<Mecanico> {
    const mecanico = await this.prisma.mecanico.create({ data });
    return mapMecanico(mecanico);
  }

  async update(id: number, data: UpdateMecanico): Promise<Mecanico | null> {
    const mecanico = await this.prisma.mecanico.update({ where: { id }, data });
    return mecanico ? mapMecanico(mecanico) : null;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.mecanico.delete({ where: { id } });
  }
}
