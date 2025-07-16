export class Cliente {
  constructor(
    public readonly id: number,
    public nombre: string,
    public email?: string,
    public telefono?: string,
    public direccion?: string
  ) {}
}
