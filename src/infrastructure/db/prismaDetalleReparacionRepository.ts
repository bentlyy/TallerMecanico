// src/infrastructure/db/prismaDetalleReparacionRepository.ts
import { DetalleReparacionRepository } from '../../domain/repositories/detalleReparacionRepository';
import { CreateDetalleReparacion, UpdateDetalleReparacion, DetalleReparacion } from '../../domain/entities/detalleReparacion';
import { PrismaClient } from '@prisma/client';

export class PrismaDetalleReparacionRepository implements DetalleReparacionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private toEntity(model: any): DetalleReparacion {
    return new DetalleReparacion(
      model.reparacionId,
      model.piezaId,
      model.cantidad,
      model.precioUnitario,
      model.descripcion
    );
  }

  async agregarDetalle(data: CreateDetalleReparacion): Promise<DetalleReparacion> {
    const detalle = await this.prisma.detalleReparacion.create({ data });
    return this.toEntity(detalle);
  }

  async eliminarDetalle(reparacionId: number, piezaId: number): Promise<void> {
    await this.prisma.detalleReparacion.delete({ where: { reparacionId_piezaId: { reparacionId, piezaId } } });
  }

  async actualizarDetalle(reparacionId: number, piezaId: number, data: UpdateDetalleReparacion): Promise<DetalleReparacion | null> {
    const detalle = await this.prisma.detalleReparacion.update({
      where: { reparacionId_piezaId: { reparacionId, piezaId } },
      data,
    });
    return this.toEntity(detalle);
  }

  async getDetallesDeReparacion(reparacionId: number): Promise<DetalleReparacion[]> {
    const detalles = await this.prisma.detalleReparacion.findMany({ where: { reparacionId } });
    return detalles.map(this.toEntity);
  }

  async calcularTotalRepuestos(reparacionId: number): Promise<number> {
    const detalles = await this.prisma.detalleReparacion.findMany({ where: { reparacionId } });
    return detalles.reduce((total, item) => total + item.cantidad * item.precioUnitario, 0);
  }
}
