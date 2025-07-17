//factura.ts
export class Factura {
  constructor(
    public id: number,
    public fecha: Date,
    public total: number,
    public clienteId: number,
    public reparacionId: number
  ) {}
}

export interface CreateFactura {
  fecha?: Date;           // opcional, se puede generar en el backend
  clienteId: number;
  reparacionId: number;
}