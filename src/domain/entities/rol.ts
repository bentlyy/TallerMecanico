export type Permisos = {
  [key: string]: boolean | string[];
};

export class Rol {
  constructor(
    public id: number,
    public nombre: string,
    public permisos: Permisos
  ) {}
}

export type CreateRol = Omit<Rol, "id">;
export type UpdateRol = Partial<CreateRol>;