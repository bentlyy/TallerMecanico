// src/infrastructure/db/prismaPiezaRepository.ts
import { PrismaClient } from '@prisma/client';
import { PiezaRepository } from '../../domain/repositories/piezaRepository';
import { Pieza, CreatePieza, UpdatePieza } from '../../domain/entities/pieza';

export class PrismaPiezaRepository implements PiezaRepository {
  constructor(private prisma: PrismaClient) {}

  async getAll(): Promise<Pieza[]> {
    const piezas = await this.prisma.pieza.findMany();
    return piezas.map(p => new Pieza(
      p.id,
      p.nombre,
      p.marca,
      p.precio,
      p.stock,
      p.codigo
    ));
  }

  async getById(id: number): Promise<Pieza | null> {
    const pieza = await this.prisma.pieza.findUnique({ where: { id } });
    return pieza ? new Pieza(
      pieza.id,
      pieza.nombre,
      pieza.marca,
      pieza.precio,
      pieza.stock,
      pieza.codigo
    ) : null;
  }

  async getByCodigo(codigo: string): Promise<Pieza | null> {
    const pieza = await this.prisma.pieza.findUnique({ where: { codigo } });
    return pieza ? new Pieza(
      pieza.id,
      pieza.nombre,
      pieza.marca,
      pieza.precio,
      pieza.stock,
      pieza.codigo
    ) : null;
  }

  async create(data: CreatePieza): Promise<Pieza> {
    const pieza = await this.prisma.pieza.create({ data });
    return new Pieza(
      pieza.id,
      pieza.nombre,
      pieza.marca,
      pieza.precio,
      pieza.stock,
      pieza.codigo
    );
  }

  async update(id: number, data: UpdatePieza): Promise<Pieza | null> {
    const pieza = await this.prisma.pieza.update({
      where: { id },
      data
    });
    return pieza ? new Pieza(
      pieza.id,
      pieza.nombre,
      pieza.marca,
      pieza.precio,
      pieza.stock,
      pieza.codigo
    ) : null;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.pieza.delete({ where: { id } });
  }

  async updateStock(id: number, cantidad: number): Promise<Pieza | null> {
    const pieza = await this.prisma.pieza.update({
      where: { id },
      data: { stock: cantidad },
    });
    return pieza ? new Pieza(
      pieza.id,
      pieza.nombre,
      pieza.marca,
      pieza.precio,
      pieza.stock,
      pieza.codigo
    ) : null;
  }
}