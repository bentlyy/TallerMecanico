// src/domain/entities/reparacionServicio.ts
export class ReparacionServicio {
  constructor(
    public id: number,
    public reparacionId: number,
    public servicioId: number,
    public cantidad: number,
    public precioUnitario: number,
    public servicio?: unknown,
  ) {}
}

export type CreateReparacionServicio = Omit<ReparacionServicio, 'id' | 'servicio'>;
