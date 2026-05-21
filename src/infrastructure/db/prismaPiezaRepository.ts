import { PrismaClient } from '@prisma/client';
import { PiezaRepository } from '../../domain/repositories/piezaRepository';
import { Pieza, CreatePieza, UpdatePieza } from '../../domain/entities/pieza';

function mapPieza(p: any): Pieza {
  return new Pieza(p.id, p.nombre, p.marca, p.precio, p.stock, p.codigo, p.empresaId);
}

export class PrismaPiezaRepository implements PiezaRepository {
  constructor(private prisma: PrismaClient) {}

  async getAll(empresaId?: number, skip?: number, limit?: number): Promise<Pieza[]> {
    const where = empresaId !== undefined ? { empresaId } : {};
    const piezas = await this.prisma.pieza.findMany({ where, skip, take: limit });
    return piezas.map(mapPieza);
  }

  async count(empresaId?: number): Promise<number> {
    const where = empresaId !== undefined ? { empresaId } : {};
    return this.prisma.pieza.count({ where });
  }

  async getById(id: number): Promise<Pieza | null> {
    const pieza = await this.prisma.pieza.findUnique({ where: { id } });
    return pieza ? mapPieza(pieza) : null;
  }

  async getByCodigo(codigo: string, empresaId: number): Promise<Pieza | null> {
    const pieza = await this.prisma.pieza.findUnique({
      where: { codigo_empresaId: { codigo, empresaId } },
    });
    return pieza ? mapPieza(pieza) : null;
  }

  async create(data: CreatePieza): Promise<Pieza> {
    const pieza = await this.prisma.pieza.create({ data });
    return mapPieza(pieza);
  }

  async update(id: number, data: UpdatePieza): Promise<Pieza | null> {
    const pieza = await this.prisma.pieza.update({ where: { id }, data });
    return pieza ? mapPieza(pieza) : null;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.pieza.delete({ where: { id } });
  }

  async updateStock(id: number, cantidad: number): Promise<Pieza | null> {
    const pieza = await this.prisma.pieza.update({ where: { id }, data: { stock: cantidad } });
    return pieza ? mapPieza(pieza) : null;
  }
}
