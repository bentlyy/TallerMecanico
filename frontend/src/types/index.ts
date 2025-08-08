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

export interface Rol {
  id: number;
  nombre: string;
  permisos: any; // JSON, puedes definir un tipo más específico si quieres
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rolId: number;
  // otros campos
}

export interface Mecanico {
  id: number;
  usuarioId: number;
  especialidad?: string; // Para mostrar nombre del usuario
}

export interface Pieza {
  id: number;
  nombre: string;
  marca: string | null;
  precio: number;
  stock: number;
  codigo: string;
}

export type EstadoReparacion = 'EN_REVISION' | 'EN_REPARACION' | 'TERMINADO' | 'ENTREGADO';

export interface Reparacion {
  id: number;
  descripcion: string;
  fechaEntrada: string; // ISO
  fechaSalida?: string | null;
  estado: EstadoReparacion;
  costoManoObra: number;
  vehiculoId: number;
  mecanicoId?: number | null;
  recepcionistaId: number;
}

export interface DetalleReparacion {
  reparacionId: number;
  piezaId: number;
  cantidad: number;
  precioUnitario: number;
  descripcion?: string | null;
}

export interface Factura {
  id: number;
  fecha: string; // viene como ISO string desde backend
  total: number;
  clienteId: number;
  reparacionId: number;
}

export interface CreateFactura {
  clienteId: number;
  reparacionId: number;
}