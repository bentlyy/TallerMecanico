import { PrismaClient } from '@prisma/client';
import { ReparacionRepository } from '../../domain/repositories/reparacionRepository';
import { Reparacion, CreateReparacion, UpdateReparacion, EstadoReparacion } from '../../domain/entities/reparacion';
import { DetalleReparacion } from '../../domain/entities/detalleReparacion';

export class PrismaReparacionRepository implements ReparacionRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToEntity(reparacion: any): Reparacion {
    return new Reparacion(
      reparacion.id,
      reparacion.descripcion,
      reparacion.fechaEntrada,
      reparacion.fechaSalida,
      reparacion.estado,
      reparacion.costoManoObra,
      reparacion.vehiculoId,
      reparacion.mecanicoId,
      reparacion.recepcionistaId
    );
  }

  async getAll(): Promise<Reparacion[]> {
    const reparaciones = await this.prisma.reparacion.findMany({
      include: {
        vehiculo: true,
        mecanico: { include: { usuario: true } },
        recepcionista: true
      }
    });
    return reparaciones.map(this.mapToEntity);
  }

  async getById(id: number): Promise<Reparacion | null> {
    const reparacion = await this.prisma.reparacion.findUnique({
      where: { id },
      include: {
        vehiculo: true,
        mecanico: { include: { usuario: true } },
        recepcionista: true
      }
    });
    return reparacion ? this.mapToEntity(reparacion) : null;
  }

  async create(data: CreateReparacion): Promise<Reparacion> {
    const reparacion = await this.prisma.reparacion.create({
      data: {
        ...data,
        vehiculo: { connect: { id: data.vehiculoId } },
        recepcionista: { connect: { id: data.recepcionistaId } }
      }
    });
    return this.mapToEntity(reparacion);
  }

  async update(id: number, data: UpdateReparacion): Promise<Reparacion | null> {
    const updateData: any = { ...data };
    
    if (data.vehiculoId) {
      updateData.vehiculo = { connect: { id: data.vehiculoId } };
      delete updateData.vehiculoId;
    }
    
    if (data.recepcionistaId) {
      updateData.recepcionista = { connect: { id: data.recepcionistaId } };
      delete updateData.recepcionistaId;
    }

    const reparacion = await this.prisma.reparacion.update({
      where: { id },
      data: updateData
    });
    return this.mapToEntity(reparacion);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.reparacion.delete({ where: { id } });
  }

  async cambiarEstado(id: number, estado: EstadoReparacion): Promise<Reparacion | null> {
    const reparacion = await this.prisma.reparacion.update({
      where: { id },
      data: { estado }
    });
    return this.mapToEntity(reparacion);
  }

  async asignarMecanico(reparacionId: number, mecanicoId: number): Promise<Reparacion | null> {
    const reparacion = await this.prisma.reparacion.update({
      where: { id: reparacionId },
      data: { 
        mecanico: { connect: { id: mecanicoId } },
        estado: 'EN_REPARACION'
      }
    });
    return this.mapToEntity(reparacion);
  }

  async registrarSalida(id: number, fechaSalida: Date): Promise<Reparacion | null> {
    const reparacion = await this.prisma.reparacion.update({
      where: { id },
      data: { 
        fechaSalida,
        estado: 'ENTREGADO'
      }
    });
    return this.mapToEntity(reparacion);
  }

  async getDetalles(reparacionId: number): Promise<DetalleReparacion[]> {
    const detalles = await this.prisma.detalleReparacion.findMany({
      where: { reparacionId },
      include: { pieza: true }
    });

    return detalles.map(d => ({
      reparacionId: d.reparacionId,
      piezaId: d.piezaId,
      cantidad: d.cantidad,
      precioUnitario: d.precioUnitario,
      pieza: {
        id: d.pieza.id,
        nombre: d.pieza.nombre,
        marca: d.pieza.marca,
        precio: d.pieza.precio,
        codigo: d.pieza.codigo
      }
    }));
  }

  async getByVehiculo(vehiculoId: number): Promise<Reparacion[]> {
    const reparaciones = await this.prisma.reparacion.findMany({
      where: { vehiculoId },
      include: {
        mecanico: { include: { usuario: true } },
        recepcionista: true
      }
    });
    return reparaciones.map(this.mapToEntity);
  }

  async getByMecanico(mecanicoId: number): Promise<Reparacion[]> {
    const reparaciones = await this.prisma.reparacion.findMany({
      where: { mecanicoId },
      include: {
        vehiculo: true,
        recepcionista: true
      }
    });
    return reparaciones.map(this.mapToEntity);
  }

  async getByRecepcionista(usuarioId: number): Promise<Reparacion[]> {
    const reparaciones = await this.prisma.reparacion.findMany({
      where: { recepcionistaId: usuarioId },
      include: {
        vehiculo: true,
        mecanico: { include: { usuario: true } }
      }
    });
    return reparaciones.map(this.mapToEntity);
  }
}