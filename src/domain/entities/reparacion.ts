export enum EstadoReparacion {
  EN_REVISION = 'EN_REVISION',
  EN_REPARACION = 'EN_REPARACION',
  TERMINADO = 'TERMINADO',
  ENTREGADO = 'ENTREGADO'
}

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

export type CreateReparacion = Omit<Reparacion, "id">;
export type UpdateReparacion = Partial<CreateReparacion>;