export class DetalleReparacion {
  constructor(
    public reparacionId: number,
    public piezaId: number,
    public cantidad: number,
    public precioUnitario: number,
    public descripcion?: string | null
  ) {}
}

export type CreateDetalleReparacion = Omit<DetalleReparacion, ''>;
export type UpdateDetalleReparacion = Partial<Omit<DetalleReparacion, 'reparacionId' | 'piezaId'>>;