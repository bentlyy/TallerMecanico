// src/infrastructure/db/prismaFacturaRepository.ts
import { PrismaClient } from '@prisma/client';
import { FacturaRepository } from '../../domain/repositories/facturaRepository';
import { Factura, CreateFactura } from '../../domain/entities/factura';

export class PrismaFacturaRepository implements FacturaRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToEntity(factura: any): Factura {
    return new Factura(
      factura.id,
      factura.fecha,
      factura.total,
      factura.clienteId,
      factura.reparacionId
    );
  }

  async getAll(): Promise<Factura[]> {
    const facturas = await this.prisma.factura.findMany({
      include: {
        cliente: true,
        reparacion: {
          include: {
            vehiculo: true,
            detalleReparacion: {
              include: { pieza: true }
            }
          }
        }
      }
    });
    return facturas.map(this.mapToEntity);
  }

  async getById(id: number): Promise<Factura | null> {
    const factura = await this.prisma.factura.findUnique({
      where: { id },
      include: {
        cliente: true,
        reparacion: {
          include: {
            vehiculo: true,
            detalleReparacion: {
              include: { pieza: true }
            }
          }
        }
      }
    });
    return factura ? this.mapToEntity(factura) : null;
  }

  async create(data: CreateFactura): Promise<Factura> {
    // Calcular el total basado en la reparación
    const reparacion = await this.prisma.reparacion.findUnique({
      where: { id: data.reparacionId },
      include: {
        detalleReparacion: true
      }
    });

    if (!reparacion) {
      throw new Error('Reparación no encontrada');
    }

    // Calcular total de repuestos
    const totalRepuestos = reparacion.detalleReparacion.reduce(
      (sum, detalle) => sum + (detalle.cantidad * detalle.precioUnitario),
      0
    );

    // Total = Mano de obra + repuestos
    const total = reparacion.costoManoObra + totalRepuestos;

    const factura = await this.prisma.factura.create({
      data: {
        fecha: new Date(),
        total,
        cliente: { connect: { id: data.clienteId } },
        reparacion: { connect: { id: data.reparacionId } }
      },
      include: {
        cliente: true,
        reparacion: true
      }
    });

    return this.mapToEntity(factura);
  }

  async getByCliente(clienteId: number): Promise<Factura[]> {
    const facturas = await this.prisma.factura.findMany({
      where: { clienteId },
      include: {
        reparacion: {
          include: {
            vehiculo: true
          }
        }
      }
    });
    return facturas.map(this.mapToEntity);
  }

  async getByReparacion(reparacionId: number): Promise<Factura | null> {
    const factura = await this.prisma.factura.findFirst({
      where: { reparacionId },
      include: {
        cliente: true,
        reparacion: {
          include: {
            vehiculo: true,
            detalleReparacion: {
              include: { pieza: true }
            }
          }
        }
      }
    });
    return factura ? this.mapToEntity(factura) : null;
  }
}