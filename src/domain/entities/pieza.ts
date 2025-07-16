export class Pieza {
  constructor(
    public id: number,
    public nombre: string,
    public marca: string | null,
    public precio: number,
    public stock: number,
    public codigo: string
  ) {}
}
