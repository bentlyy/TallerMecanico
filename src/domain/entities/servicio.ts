// src/domain/entities/servicio.ts
export class Servicio {
  constructor(
    public id: number,
    public nombre: string,
    public descripcion: string | null,
    public problemaReportado: string | null,
    public diagnostico: string | null,
    public trabajosRealizados: string | null,
    public precioBase: number,
    public activo: boolean,
    public empresaId: number,
  ) {}
}

export type CreateServicio = Omit<Servicio, 'id'>;
export type UpdateServicio = Partial<Omit<Servicio, 'id' | 'empresaId'>>;
