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
    public recepcionistaId: number
  ) {}
}

export type CreateReparacion = Omit<Reparacion, 'id' | 'fechaEntrada' | 'fechaSalida' | 'estado'>;
export type UpdateReparacion = Partial<CreateReparacion>;
export { EstadoReparacion };