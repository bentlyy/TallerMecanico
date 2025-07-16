import { PiezaRepository } from "../../domain/repositories/piezaRepository";
import { Pieza } from "../../domain/entities/pieza";
import { prisma } from './prisma';

export class PrismaPiezaRepository implements PiezaRepository {
  async getAll(): Promise<Pieza[]> {
    const piezas = await prisma.pieza.findMany();
    return piezas.map(p => new Pieza(p.id, p.nombre, p.marca ?? null, p.precio, p.stock, p.codigo));
  }

  async getById(id: number): Promise<Pieza | null> {
    const p = await prisma.pieza.findUnique({ where: { id } });
    return p ? new Pieza(p.id, p.nombre, p.marca ?? null, p.precio, p.stock, p.codigo) : null;
  }

  async getByCodigo(codigo: string): Promise<Pieza | null> {
    const p = await prisma.pieza.findUnique({ where: { codigo } });
    return p ? new Pieza(p.id, p.nombre, p.marca ?? null, p.precio, p.stock, p.codigo) : null;
  }

  async create(data: Omit<Pieza, "id">): Promise<Pieza> {
    const p = await prisma.pieza.create({ data });
    return new Pieza(p.id, p.nombre, p.marca ?? null, p.precio, p.stock, p.codigo);
  }

  async update(id: number, data: Partial<Omit<Pieza, "id">>): Promise<Pieza | null> {
    const p = await prisma.pieza.update({ where: { id }, data });
    return new Pieza(p.id, p.nombre, p.marca ?? null, p.precio, p.stock, p.codigo);
  }

  async delete(id: number): Promise<void> {
    await prisma.pieza.delete({ where: { id } });
  }
}
