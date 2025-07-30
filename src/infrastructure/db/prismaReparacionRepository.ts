import { PrismaClient, EstadoReparacion as PrismaEstadoReparacion } from '@prisma/client';
import { ReparacionRepository } from '../../domain/repositories/reparacionRepository';
import { Reparacion, CreateReparacion, UpdateReparacion, EstadoReparacion } from '../../domain/entities/reparacion';
import { DetalleReparacion } from '../../domain/entities/detalleReparacion';

// Mapeo de enums
const mapEstadoToPrisma = (estado: EstadoReparacion): PrismaEstadoReparacion => {
  return estado as PrismaEstadoReparacion;
};

const mapEstadoFromPrisma = (estado: PrismaEstadoReparacion): EstadoReparacion => {
  return estado as EstadoReparacion;
};

export class PrismaReparacionRepository implements ReparacionRepository {
  constructor(private prisma: PrismaClient) {}

  async getAll(): Promise<Reparacion[]> {
    const reparaciones = await this.prisma.reparacion.findMany();
    return reparaciones.map(r => this.mapToDomain(r));
  }

  async getById(id: number): Promise<Reparacion | null> {
    const reparacion = await this.prisma.reparacion.findUnique({ 
      where: { id },
      include: {
        vehiculo: true,
        mecanico: true,
        recepcionista: true
      }
    });
    return reparacion ? this.mapToDomain(reparacion) : null;
  }

  async create(data: CreateReparacion): Promise<Reparacion> {
    const reparacion = await this.prisma.reparacion.create({
      data: {
        descripcion: data.descripcion,
        fechaEntrada: data.fechaEntrada,
        fechaSalida: data.fechaSalida,
        estado: mapEstadoToPrisma(data.estado),
        costoManoObra: data.costoManoObra,
        vehiculoId: data.vehiculoId,
        mecanicoId: data.mecanicoId,
        recepcionistaId: data.recepcionistaId
      }
    });
    return this.mapToDomain(reparacion);
  }

  async update(id: number, data: UpdateReparacion): Promise<Reparacion | null> {
    const reparacion = await this.prisma.reparacion.update({
      where: { id },
      data: {
        descripcion: data.descripcion,
        fechaEntrada: data.fechaEntrada,
        fechaSalida: data.fechaSalida,
        estado: data.estado ? mapEstadoToPrisma(data.estado) : undefined,
        costoManoObra: data.costoManoObra,
        vehiculoId: data.vehiculoId,
        mecanicoId: data.mecanicoId,
        recepcionistaId: data.recepcionistaId
      }
    });
    return this.mapToDomain(reparacion);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.reparacion.delete({ where: { id } });
  }

  async updateEstado(id: number, estado: EstadoReparacion): Promise<Reparacion | null> {
    const reparacion = await this.prisma.reparacion.update({
      where: { id },
      data: { estado: mapEstadoToPrisma(estado) }
    });
    return this.mapToDomain(reparacion);
  }

  async asignarMecanico(id: number, mecanicoId: number | null): Promise<Reparacion | null> {
    const reparacion = await this.prisma.reparacion.update({
      where: { id },
      data: { mecanicoId }
    });
    return this.mapToDomain(reparacion);
  }

  async registrarSalida(id: number, fechaSalida: Date): Promise<Reparacion | null> {
    const reparacion = await this.prisma.reparacion.update({
      where: { id },
      data: { 
        fechaSalida,
        estado: mapEstadoToPrisma(EstadoReparacion.ENTREGADO)
      }
    });
    return this.mapToDomain(reparacion);
  }

  async getDetallesReparacion(reparacionId: number): Promise<DetalleReparacion[]> {
    const detalles = await this.prisma.detalleReparacion.findMany({
      where: { reparacionId }
    });
    return detalles.map(d => new DetalleReparacion(
      d.reparacionId,
      d.piezaId,
      d.cantidad,
      d.precioUnitario
    ));
  }

  async getByVehiculo(vehiculoId: number): Promise<Reparacion[]> {
    const reparaciones = await this.prisma.reparacion.findMany({
      where: { vehiculoId }
    });
    return reparaciones.map(r => this.mapToDomain(r));
  }

  async getByMecanico(mecanicoId: number): Promise<Reparacion[]> {
    const reparaciones = await this.prisma.reparacion.findMany({
      where: { mecanicoId }
    });
    return reparaciones.map(r => this.mapToDomain(r));
  }

  async getByRecepcionista(recepcionistaId: number): Promise<Reparacion[]> {
    const reparaciones = await this.prisma.reparacion.findMany({
      where: { recepcionistaId }
    });
    return reparaciones.map(r => this.mapToDomain(r));
  }

  async addDetalleReparacion(reparacionId: number, piezaId: number, cantidad: number, precioUnitario: number): Promise<DetalleReparacion> {
    const detalle = await this.prisma.detalleReparacion.create({
      data: {
        reparacionId,
        piezaId,
        cantidad,
        precioUnitario
      }
    });
    return new DetalleReparacion(
      detalle.reparacionId,
      detalle.piezaId,
      detalle.cantidad,
      detalle.precioUnitario
    );
  }

  async removeDetalleReparacion(reparacionId: number, piezaId: number): Promise<void> {
    await this.prisma.detalleReparacion.delete({
      where: {
        reparacionId_piezaId: {
          reparacionId,
          piezaId
        }
      }
    });
  }

  private mapToDomain(reparacion: any): Reparacion {
    return new Reparacion(
      reparacion.id,
      reparacion.descripcion,
      reparacion.fechaEntrada,
      reparacion.fechaSalida,
      mapEstadoFromPrisma(reparacion.estado),
      reparacion.costoManoObra,
      reparacion.vehiculoId,
      reparacion.mecanicoId,
      reparacion.recepcionistaId
    );
  }
}