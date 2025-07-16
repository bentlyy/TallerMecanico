import { PrismaClient } from '@prisma/client';
import { DetalleReparacionRepository } from '../../domain/repositories/detalleReparacionRepository';
import { DetalleReparacion, CreateDetalle, UpdateDetalle } from '../../domain/entities/detalleReparacion';

export class PrismaDetalleReparacionRepository implements DetalleReparacionRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToEntity(detalle: any): DetalleReparacion {
    return {
      reparacionId: detalle.reparacionId,
      piezaId: detalle.piezaId,
      cantidad: detalle.cantidad,
      precioUnitario: detalle.precioUnitario,
      pieza: detalle.pieza ? {
        id: detalle.pieza.id,
        nombre: detalle.pieza.nombre,
        marca: detalle.pieza.marca,
        codigo: detalle.pieza.codigo
      } : undefined
    };
  }

  async create(data: CreateDetalle): Promise<DetalleReparacion> {
    const detalle = await this.prisma.detalleReparacion.create({
      data: {
        reparacionId: data.reparacionId,
        piezaId: data.piezaId,
        cantidad: data.cantidad,
        precioUnitario: data.precioUnitario
      },
      include: { pieza: true }
    });
    
    // Descontar stock de la pieza
    await this.prisma.pieza.update({
      where: { id: data.piezaId },
      data: { stock: { decrement: data.cantidad } }
    });
    
    return this.mapToEntity(detalle);
  }

  async delete(reparacionId: number, piezaId: number): Promise<void> {
    // Primero obtenemos el detalle para saber la cantidad a devolver
    const detalle = await this.prisma.detalleReparacion.findUnique({
      where: {
        reparacionId_piezaId: { reparacionId, piezaId }
      }
    });
    
    if (detalle) {
      // Eliminar el detalle
      await this.prisma.detalleReparacion.delete({
        where: {
          reparacionId_piezaId: { reparacionId, piezaId }
        }
      });
      
      // Devolver el stock
      await this.prisma.pieza.update({
        where: { id: piezaId },
        data: { stock: { increment: detalle.cantidad } }
      });
    }
  }

  async update(reparacionId: number, piezaId: number, data: UpdateDetalle): Promise<DetalleReparacion | null> {
    // Primero obtenemos el detalle actual
    const detalleActual = await this.prisma.detalleReparacion.findUnique({
      where: {
        reparacionId_piezaId: { reparacionId, piezaId }
      }
    });
    
    if (!detalleActual) return null;
    
    // Actualizamos el detalle
    const detalle = await this.prisma.detalleReparacion.update({
      where: {
        reparacionId_piezaId: { reparacionId, piezaId }
      },
      data,
      include: { pieza: true }
    });
    
    // Si cambió la cantidad, ajustamos el stock
    if (data.cantidad !== undefined) {
      const diferencia = data.cantidad - detalleActual.cantidad;
      await this.prisma.pieza.update({
        where: { id: piezaId },
        data: { stock: { decrement: diferencia } }
      });
    }
    
    return this.mapToEntity(detalle);
  }

  async getByReparacion(reparacionId: number): Promise<DetalleReparacion[]> {
    const detalles = await this.prisma.detalleReparacion.findMany({
      where: { reparacionId },
      include: { pieza: true }
    });
    
    return detalles.map(this.mapToEntity);
  }

  async calcularTotalRepuestos(reparacionId: number): Promise<number> {
    const detalles = await this.prisma.detalleReparacion.findMany({
      where: { reparacionId },
      select: { cantidad: true, precioUnitario: true }
    });
    
    return detalles.reduce((total, detalle) => {
      return total + (detalle.cantidad * detalle.precioUnitario);
    }, 0);
  }
}