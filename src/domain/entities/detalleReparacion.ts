export class DetalleReparacion {
  constructor(
    public reparacionId: number,
    public piezaId: number,
    public cantidad: number,
    public precioUnitario: number
  ) {}
}
