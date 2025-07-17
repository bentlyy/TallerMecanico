export type EstadoReparacion = 'EN_REVISION' | 'EN_REPARACION' | 'TERMINADO' | 'ENTREGADO';

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

// Este es el tipo para crear una nueva reparación
export interface CreateReparacion {
  descripcion: string;
  fechaEntrada?: Date;
  fechaSalida?: Date | null;
  estado?: EstadoReparacion;
  costoManoObra?: number;
  vehiculoId: number;
  mecanicoId?: number | null;
  recepcionistaId: number;
}


// Este es el tipo para actualizar una reparación
export interface UpdateReparacion {
  descripcion?: string;
  fechaSalida?: Date | null;
  estado?: EstadoReparacion;
  costoManoObra?: number;
  vehiculoId?: number;
  mecanicoId?: number | null;
  recepcionistaId?: number;
}
