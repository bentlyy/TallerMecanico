// src/domain/entities/mecanico.ts
export class Mecanico {
  constructor(
    public id: number,
    public usuarioId: number,
    public especialidad: string | null
  ) {}
}

export type CreateMecanico = Omit<Mecanico, "id">;
export type UpdateMecanico = Partial<CreateMecanico>;