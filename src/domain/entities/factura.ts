export class Factura {
  constructor(
    public id: number,
    public fecha: Date,
    public total: number,
    public clienteId: number,
    public reparacionId: number
  ) {}
}
