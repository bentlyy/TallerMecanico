//cliente.ts
export class Cliente {
  constructor(
    public id: number,
    public nombre: string,
    public email: string | null,
    public telefono: string | null,
    public direccion: string | null,
    public empresaId: number,
    public rut: string | null = null,
  ) {}
}

export type CreateCliente = Omit<Cliente, 'id' | 'rut'> & { rut?: string | null };
export type UpdateCliente = Partial<CreateCliente>;
