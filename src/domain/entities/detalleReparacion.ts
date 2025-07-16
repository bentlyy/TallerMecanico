export interface DetalleReparacion {
  reparacionId: number;
  piezaId: number;
  cantidad: number;
  precioUnitario: number;
  pieza?: {
    id: number;
    nombre: string;
    marca: string | null;
    codigo: string;
  };
}

export type CreateDetalle = Omit<DetalleReparacion, "pieza">;
export type UpdateDetalle = Partial<CreateDetalle>;