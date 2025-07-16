// src/domain/entities/reparacion.ts
export type EstadoReparacion = 'en_revision' | 'en_reparacion' | 'terminado' | 'entregado';

export class Reparacion {
  constructor(
    public id: number,
    public descripcion: string,
    public fechaEntrada: Date,
    public fechaSalida: Date | null,
    public estado: EstadoReparacion, // Usa el tipo específico
    public costoManoObra: number,
    public vehiculoId: number,
    public mecanicoId: number | null,
    public recepcionistaId: number
  ) {}
}