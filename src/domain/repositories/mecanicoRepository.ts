// src/domain/repositories/mecanicoRepository.ts
import { Mecanico, CreateMecanico, UpdateMecanico } from "../entities/mecanico";

export interface MecanicoRepository {
  getAll(): Promise<Mecanico[]>;
  getById(id: number): Promise<Mecanico | null>;
  getByUsuarioId(usuarioId: number): Promise<Mecanico | null>;
  create(data: CreateMecanico): Promise<Mecanico>;
  update(id: number, data: UpdateMecanico): Promise<Mecanico | null>;
  delete(id: number): Promise<void>;
}