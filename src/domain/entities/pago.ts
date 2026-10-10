export class Pago {
  constructor(
    public id: number,
    public facturaId: number,
    public fecha: Date,
    public monto: number,
    public metodo: string,
    public nota: string | null = null,
  ) {}
}

export interface CreatePago {
  facturaId: number;
  monto: number;
  metodo: string;
  nota?: string | null;
  fecha?: Date;
}

export const METODOS_PAGO = ['EFECTIVO', 'TRANSFERENCIA', 'TARJETA', 'OTRO'] as const;
export type MetodoPago = (typeof METODOS_PAGO)[number];
