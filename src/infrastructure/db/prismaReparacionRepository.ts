// src/infrastructure/db/prismaReparacionRepository.ts
import { ReparacionRepository } from '../../domain/repositories/reparacionRepository';
import { Reparacion, CreateReparacion, UpdateReparacion } from '../../domain/entities/reparacion';
import { PrismaClient, EstadoReparacion } from '@prisma/client';

export class PrismaReparacionRepository implements ReparacionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private toEntity(model: any): Reparacion {
    return new Reparacion(
      model.id,
      model.descripcion,
      model.fechaEntrada,
      model.fechaSalida,
      model.estado,
      model.costoManoObra,
      model.vehiculoId,
      model.mecanicoId,
      model.recepcionistaId
    );
  }

  async getAll(): Promise<Reparacion[]> {
    const reps = await this.prisma.reparacion.findMany();
    return reps.map(this.toEntity);
  }

  async getById(id: number): Promise<Reparacion | null> {
    const rep = await this.prisma.reparacion.findUnique({ where: { id } });
    return rep ? this.toEntity(rep) : null;
  }

  async create(data: CreateReparacion): Promise<Reparacion> {
    const rep = await this.prisma.reparacion.create({
      data: {
        ...data,
        estado: EstadoReparacion.EN_REVISION,
        fechaEntrada: new Date(),
      },
    });
    return this.toEntity(rep);
  }

  async update(id: number, data: UpdateReparacion): Promise<Reparacion | null> {
    const rep = await this.prisma.reparacion.update({
      where: { id },
      data,
    });
    return this.toEntity(rep);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.reparacion.delete({ where: { id } });
  }

  async cambiarEstado(id: number, estado: string): Promise<Reparacion | null> {
    const rep = await this.prisma.reparacion.update({
      where: { id },
      data: { estado: estado as EstadoReparacion },
    });
    return this.toEntity(rep);
  }

  async asignarMecanico(id: number, mecanicoId: number): Promise<Reparacion | null> {
    const rep = await this.prisma.reparacion.update({
      where: { id },
      data: { mecanicoId },
    });
    return this.toEntity(rep);
  }

  async registrarSalida(id: number, fecha: Date): Promise<Reparacion | null> {
    const rep = await this.prisma.reparacion.update({
      where: { id },
      data: { fechaSalida: fecha },
    });
    return this.toEntity(rep);
  }

  async getByVehiculo(vehiculoId: number): Promise<Reparacion[]> {
    const reps = await this.prisma.reparacion.findMany({ where: { vehiculoId } });
    return reps.map(this.toEntity);
  }

  async getByMecanico(mecanicoId: number): Promise<Reparacion[]> {
    const reps = await this.prisma.reparacion.findMany({ where: { mecanicoId } });
    return reps.map(this.toEntity);
  }

  async getByRecepcionista(usuarioId: number): Promise<Reparacion[]> {
    const reps = await this.prisma.reparacion.findMany({ where: { recepcionistaId: usuarioId } });
    return reps.map(this.toEntity);
  }
}
