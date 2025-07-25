export class Rol {
  constructor(
    public id: number,
    public nombre: string,
    public permisos: Record<string, boolean>
  ) {}
}

export type CreateRol = Omit<Rol, "id">;
export type UpdateRol = Partial<CreateRol>;