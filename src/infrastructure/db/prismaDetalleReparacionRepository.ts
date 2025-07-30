import { PrismaClient } from '@prisma/client';
import { DetalleReparacionRepository } from '../../domain/repositories/detalleReparacionRepository';
import { DetalleReparacion, CreateDetalleReparacion, UpdateDetalleReparacion } from '../../domain/entities/detalleReparacion';

export class PrismaDetalleReparacionRepository implements DetalleReparacionRepository {
  constructor(private prisma: PrismaClient) {}

  async getAll(): Promise<DetalleReparacion[]> {
    const detalles = await this.prisma.detalleReparacion.findMany({
      include: {
        pieza: true,
        reparacion: true
      }
    });
    
    return detalles.map(d => new DetalleReparacion(
      d.id,
      d.reparacionId,
      d.piezaId,
      d.cantidad,
      d.precioUnitario,
      d.descripcion ?? undefined
    ));
  }

  async getById(id: number): Promise<DetalleReparacion | null> {
    const detalle = await this.prisma.detalleReparacion.findUnique({
      where: { id },
      include: {
        pieza: true,
        reparacion: true
      }
    });
    
    if (!detalle) return null;
    
    return new DetalleReparacion(
      detalle.id,
      detalle.reparacionId,
      detalle.piezaId,
      detalle.cantidad,
      detalle.precioUnitario,
      detalle.descripcion ?? undefined
    );
  }

  async create(data: CreateDetalleReparacion): Promise<DetalleReparacion> {
    const detalle = await this.prisma.detalleReparacion.create({
      data: {
        reparacionId: data.reparacionId,
        piezaId: data.piezaId,
        cantidad: data.cantidad,
        precioUnitario: data.precioUnitario,
        descripcion: data.descripcion
      },
      include: {
        pieza: true,
        reparacion: true
      }
    });
    
    return new DetalleReparacion(
      detalle.id,
      detalle.reparacionId,
      detalle.piezaId,
      detalle.cantidad,
      detalle.precioUnitario,
      detalle.descripcion ?? undefined
    );
  }

  async update(id: number, data: UpdateDetalleReparacion): Promise<DetalleReparacion | null> {
    const detalle = await this.prisma.detalleReparacion.update({
      where: { id },
      data: {
        cantidad: data.cantidad,
        precioUnitario: data.precioUnitario,
        descripcion: data.descripcion
      },
      include: {
        pieza: true,
        reparacion: true
      }
    });
    
    return new DetalleReparacion(
      detalle.id,
      detalle.reparacionId,
      detalle.piezaId,
      detalle.cantidad,
      detalle.precioUnitario,
      detalle.descripcion ?? undefined
    );
  }

  async delete(id: number): Promise<void> {
    await this.prisma.detalleReparacion.delete({
      where: { id }
    });
  }

  async getByReparacion(reparacionId: number): Promise<DetalleReparacion[]> {
    const detalles = await this.prisma.detalleReparacion.findMany({
      where: { reparacionId },
      include: {
        pieza: true
      }
    });
    
    return detalles.map(d => new DetalleReparacion(
      d.id,
      d.reparacionId,
      d.piezaId,
      d.cantidad,
      d.precioUnitario,
      d.descripcion ?? undefined
    ));
  }

  async getByPieza(piezaId: number): Promise<DetalleReparacion[]> {
    const detalles = await this.prisma.detalleReparacion.findMany({
      where: { piezaId },
      include: {
        reparacion: true
      }
    });
    
    return detalles.map(d => new DetalleReparacion(
      d.id,
      d.reparacionId,
      d.piezaId,
      d.cantidad,
      d.precioUnitario,
      d.descripcion ?? undefined
    ));
  }

  async getByReparacionAndPieza(reparacionId: number, piezaId: number): Promise<DetalleReparacion | null> {
    const detalle = await this.prisma.detalleReparacion.findFirst({
      where: {
        reparacionId,
        piezaId
      },
      include: {
        pieza: true,
        reparacion: true
      }
    });
    
    if (!detalle) return null;
    
    return new DetalleReparacion(
      detalle.id,
      detalle.reparacionId,
      detalle.piezaId,
      detalle.cantidad,
      detalle.precioUnitario,
      detalle.descripcion ?? undefined
    );
  }

  async updateCantidad(id: number, cantidad: number): Promise<DetalleReparacion | null> {
    const detalle = await this.prisma.detalleReparacion.update({
      where: { id },
      data: { cantidad },
      include: {
        pieza: true,
        reparacion: true
      }
    });
    
    return new DetalleReparacion(
      detalle.id,
      detalle.reparacionId,
      detalle.piezaId,
      detalle.cantidad,
      detalle.precioUnitario,
      detalle.descripcion ?? undefined
    );
  }
}