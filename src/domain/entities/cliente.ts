//cliente.ts
export class Cliente {
  constructor(
    public id: number,
    public nombre: string,
    public email: string | null,
    public telefono: string | null,
    public direccion: string | null,
    public empresaId: number,
  ) {}
}

export type CreateCliente = Omit<Cliente, 'id'>;
export type UpdateCliente = Partial<CreateCliente>;
