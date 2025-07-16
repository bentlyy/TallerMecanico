import { Mecanico, CreateMecanico, UpdateMecanico } from "../entities/mecanico";
import { Reparacion } from "../entities/reparacion";

export interface MecanicoRepository {
  getAll(): Promise<Mecanico[]>;
  getById(id: number): Promise<Mecanico | null>;
  create(data: CreateMecanico): Promise<Mecanico>;
  update(id: number, data: UpdateMecanico): Promise<Mecanico | null>;
  getReparacionesAsignadas(mecanicoId: number): Promise<Reparacion[]>;
}