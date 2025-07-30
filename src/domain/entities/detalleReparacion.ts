export class DetalleReparacion {
  constructor(
    public id: number,
    public reparacionId: number,
    public piezaId: number,
    public cantidad: number,
    public precioUnitario: number,
    public descripcion?: string
  ) {}
}

export type CreateDetalleReparacion = Omit<DetalleReparacion, "id">;
export type UpdateDetalleReparacion = Partial<CreateDetalleReparacion>;