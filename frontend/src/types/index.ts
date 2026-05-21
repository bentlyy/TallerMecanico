export interface Cliente {
  id: number;
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  empresaId: number;
  vehiculos?: Vehiculo[];
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
  permisos: Record<string, boolean>;
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rolId: number;
  rolNombre?: string;
  activo?: boolean;
  empresaId?: number;
}

export interface Mecanico {
  id: number;
  usuarioId: number;
  especialidad?: string;
  usuario?: Usuario;
}

export interface Pieza {
  id: number;
  nombre: string;
  marca: string | null;
  precio: number;
  stock: number;
  codigo: string;
  empresaId: number;
}

export type EstadoReparacion = 'EN_REVISION' | 'EN_REPARACION' | 'TERMINADO' | 'ENTREGADO';

export interface Reparacion {
  id: number;
  descripcion: string;
  fechaEntrada: string;
  fechaSalida?: string | null;
  estado: EstadoReparacion;
  costoManoObra: number;
  vehiculoId: number;
  mecanicoId?: number | null;
  recepcionistaId: number;
  vehiculo?: Vehiculo;
  mecanico?: Mecanico;
}

export interface DetalleReparacion {
  id?: number;
  reparacionId: number;
  piezaId: number;
  cantidad: number;
  precioUnitario: number;
  descripcion?: string | null;
  pieza?: Pieza;
}

export interface Factura {
  id: number;
  fecha: string;
  clienteId: number;
  reparacionId: number;
  total: number;
  cliente?: Cliente;
  reparacion?: Reparacion;
}

export interface CreateFactura {
  clienteId: number;
  reparacionId: number;
  total: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  usuario: {
    id: number;
    email: string;
    nombre: string;
    rolId: number;
    rolNombre: string;
    empresaId: number;
  };
}

export interface DashboardStats {
  totalClientes: number;
  totalVehiculos: number;
  reparacionesPendientes: number;
  reparacionesEnProceso: number;
  totalFacturas: number;
  facturasMes: number;
}
