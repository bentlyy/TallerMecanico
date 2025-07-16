export class Vehiculo {
  constructor(
    public id: number,
    public marca: string,
    public modelo: string,
    public anio: number | null,
    public patente: string,
    public kilometraje: number | null,
    public cliente_id: number
  ) {}
}
