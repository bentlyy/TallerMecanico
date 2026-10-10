// src/domain/entities/mecanico.ts
export interface MecanicoUsuario {
  id: number;
  email: string;
  nombre: string;
  rolId: number;
}

export class Mecanico {
  constructor(
    public id: number,
    public usuarioId: number,
    public especialidad: string | null,
    public usuario?: MecanicoUsuario,
  ) {}
}

export type CreateMecanico = Omit<Mecanico, 'id' | 'usuario'>;
export type UpdateMecanico = Partial<CreateMecanico>;
