export class Vehiculo {
  constructor(
    public id: number,
    public marca: string,
    public patente: string,
    public modelo: string,
    public clienteId: number,
    public anio?: number,
    public kilometraje?: number,
  ) {}
}
