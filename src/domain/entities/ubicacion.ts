// src/domain/entities/ubicacion.ts
import { TipoUbicacion } from '@prisma/client';

export class Ubicacion {
  constructor(
    public id: number,
    public nombre: string,
    public tipo: TipoUbicacion,
    public orden: number,
    public activo: boolean,
    public empresaId: number,
  ) {}
}

export type CreateUbicacion = Omit<Ubicacion, 'id'>;
export type UpdateUbicacion = Partial<CreateUbicacion>;

export class MovimientoUbicacion {
  constructor(
    public id: number,
    public reparacionId: number,
    public ubicacionId: number | null,
    public ubicacionNombre: string | null,
    public usuarioId: number | null,
    public nota: string | null,
    public fecha: Date,
  ) {}
}

export type CreateMovimientoUbicacion = Omit<MovimientoUbicacion, 'id' | 'fecha'>;

export { TipoUbicacion };
