// src/domain/entities/reparacion.ts
import { EstadoReparacion } from '@prisma/client';

export class Reparacion {
  constructor(
    public id: number,
    public descripcion: string,
    public fechaEntrada: Date,
    public fechaSalida: Date | null,
    public estado: EstadoReparacion,
    public costoManoObra: number,
    public vehiculoId: number,
    public mecanicoId: number | null,
    public recepcionistaId: number,
    public problemaReportado: string | null = null,
    public diagnostico: string | null = null,
    public trabajosRealizados: string | null = null,
    public ubicacionId: number | null = null,
    public observaciones: string | null = null,
  ) {}
}

export type CreateReparacion = Omit<Reparacion, 'id' | 'fechaEntrada' | 'fechaSalida' | 'estado' | 'ubicacionId'> & {
  ubicacionId?: number | null;
  estado?: EstadoReparacion;
  fechaEntrada?: Date;
  fechaSalida?: Date | null;
  observaciones?: string | null;
};
export type UpdateReparacion = Partial<CreateReparacion>;
export { EstadoReparacion };
