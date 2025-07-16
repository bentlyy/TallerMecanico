import { PrismaClient } from '@prisma/client';
import { PiezaRepository } from '../../domain/repositories/piezaRepository';
import { Pieza, CreatePieza, UpdatePieza } from '../../domain/entities/pieza';

export class PrismaPiezaRepository implements PiezaRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToEntity(pieza: any): Pieza {
    return new Pieza(
      pieza.id,
      pieza.nombre,
      pieza.marca,
      pieza.precio,
      pieza.stock,
      pieza.codigo
    );
  }

  async getAll(): Promise<Pieza[]> {
    const piezas = await this.prisma.pieza.findMany();
    return piezas.map(this.mapToEntity);
  }

  async getById(id: number): Promise<Pieza | null> {
    const pieza = await this.prisma.pieza.findUnique({ where: { id } });
    return pieza ? this.mapToEntity(pieza) : null;
  }

  async getByCodigo(codigo: string): Promise<Pieza | null> {
    const pieza = await this.prisma.pieza.findUnique({ where: { codigo } });
    return pieza ? this.mapToEntity(pieza) : null;
  }

  async create(data: CreatePieza): Promise<Pieza> {
    const pieza = await this.prisma.pieza.create({ data });
    return this.mapToEntity(pieza);
  }

  async update(id: number, data: UpdatePieza): Promise<Pieza | null> {
    const pieza = await this.prisma.pieza.update({
      where: { id },
      data
    });
    return this.mapToEntity(pieza);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.pieza.delete({ where: { id } });
  }

  async updateStock(id: number, nuevaCantidad: number): Promise<Pieza | null> {
    const pieza = await this.prisma.pieza.update({
      where: { id },
      data: { stock: nuevaCantidad }
    });
    return this.mapToEntity(pieza);
  }

  async decreaseStock(id: number, cantidad: number): Promise<Pieza | null> {
    const pieza = await this.prisma.pieza.update({
      where: { id },
      data: { stock: { decrement: cantidad } }
    });
    return this.mapToEntity(pieza);
  }
}