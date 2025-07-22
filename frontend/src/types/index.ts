export interface Cliente {
  id: number;
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
}

export interface Vehiculo {
  id: number;
  marca: string;
  modelo: string;
  anio?: number;
  patente: string;
  kilometraje?: number;
  clienteId: number;
}
