export class Usuario {
  constructor(
    public id: number,
    public email: string,
    public passwordHash: string,
    public nombre: string,
    public activo: boolean,
    public rolId: number
  ) {}
}

export type CreateUsuario = Omit<Usuario, "id">;
export type UpdateUsuario = Partial<Omit<Usuario, "id" | "passwordHash">> & {
  password?: string;
};