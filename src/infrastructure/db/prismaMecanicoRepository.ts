import { PrismaClient } from '@prisma/client';
import { MecanicoRepository } from '../../domain/repositories/mecanicoRepository';
import { Mecanico, CreateMecanico, UpdateMecanico } from '../../domain/entities/mecanico';
import { Reparacion } from '../../domain/entities/reparacion';

export class PrismaMecanicoRepository implements MecanicoRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToEntity(mecanico: any): Mecanico {
    return new Mecanico(
      mecanico.id,
      mecanico.usuarioId,
      mecanico.especialidad
    );
  }

  async getAll(): Promise<Mecanico[]> {
    const mecanicos = await this.prisma.mecanico.findMany({
      include: { usuario: true }
    });
    return mecanicos.map(this.mapToEntity);
  }

  async getById(id: number): Promise<Mecanico | null> {
    const mecanico = await this.prisma.mecanico.findUnique({ 
      where: { id },
      include: { usuario: true }
    });
    return mecanico ? this.mapToEntity(mecanico) : null;
  }

  async create(data: CreateMecanico): Promise<Mecanico> {
    const mecanico = await this.prisma.mecanico.create({ 
      data: {
        usuario: { connect: { id: data.usuarioId } },
        especialidad: data.especialidad
      }
    });
    return this.mapToEntity(mecanico);
  }

  async update(id: number, data: UpdateMecanico): Promise<Mecanico | null> {
    const mecanico = await this.prisma.mecanico.update({
      where: { id },
      data
    });
    return this.mapToEntity(mecanico);
  }

  async getReparacionesAsignadas(mecanicoId: number): Promise<Reparacion[]> {
    const reparaciones = await this.prisma.reparacion.findMany({
      where: { mecanicoId },
      include: {
        vehiculo: true,
        recepcionista: true
      }
    });

    return reparaciones.map(r => new Reparacion(
      r.id,
      r.descripcion,
      r.fechaEntrada,
      r.fechaSalida,
      r.estado,
      r.costoManoObra,
      r.vehiculoId,
      r.mecanicoId,
      r.recepcionistaId
    ));
  }
}