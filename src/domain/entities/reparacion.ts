export const EstadosReparacion = {
  EN_REVISION: 'EN_REVISION',
  EN_REPARACION: 'EN_REPARACION',
  TERMINADO: 'TERMINADO',
  ENTREGADO: 'ENTREGADO'
} as const;

export type EstadoReparacion = typeof EstadosReparacion[keyof typeof EstadosReparacion];

export class Reparacion {
  constructor(
    public id: number,
    public descripcion: string,
    public fechaEntrada: Date,
    public fechaSalida: Date | null,
    public estado: EstadoReparacion, // Usamos el tipo específico
    public costoManoObra: number,
    public vehiculoId: number,
    public mecanicoId: number | null,
    public recepcionistaId: number
  ) {}
}