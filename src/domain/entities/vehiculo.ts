export class Vehiculo {
  constructor(
    public id: number,
    public marca: string,
    public modelo: string,
    public anio: number | null,
    public patente: string,
    public kilometraje: number | null,
    public clienteId: number
  ) {}
}

export type CreateVehiculo = Omit<Vehiculo, "id">;
export type UpdateVehiculo = Partial<CreateVehiculo>;