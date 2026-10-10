export interface Cliente {
  id: number;
  nombre: string;
  rut?: string;
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

export interface Servicio {
  id: number;
  nombre: string;
  descripcion?: string | null;
  problemaReportado?: string | null;
  diagnostico?: string | null;
  trabajosRealizados?: string | null;
  precioBase: number;
  activo: boolean;
  empresaId?: number;
}

export interface ReparacionServicio {
  id: number;
  reparacionId: number;
  servicioId: number;
  cantidad: number;
  precioUnitario: number;
  servicio?: Servicio;
}

export type TipoUbicacion =
  | 'RECEPCION'
  | 'ESTACIONAMIENTO'
  | 'BAHIA'
  | 'ELEVADOR'
  | 'FOSO'
  | 'DIAGNOSTICO'
  | 'ALINEACION'
  | 'NEUMATICOS'
  | 'LUBRICACION'
  | 'ELECTRICIDAD'
  | 'CHAPA_PINTURA'
  | 'LAVADO'
  | 'TERMINADOS'
  | 'OTRO';

export interface Ubicacion {
  id: number;
  nombre: string;
  tipo: TipoUbicacion;
  orden: number;
  activo: boolean;
  empresaId: number;
}

export interface MovimientoUbicacion {
  id: number;
  reparacionId: number;
  ubicacionId: number | null;
  ubicacionNombre: string | null;
  usuarioId: number | null;
  nota: string | null;
  fecha: string;
}

export type EstadoReparacion = 'EN_REVISION' | 'EN_REPARACION' | 'TERMINADO' | 'FACTURADO' | 'PAGADO' | 'ENTREGADO';

export type MetodoPago = 'EFECTIVO' | 'TRANSFERENCIA' | 'TARJETA' | 'OTRO';

export interface Pago {
  id: number;
  facturaId: number;
  fecha: string;
  monto: number;
  metodo: MetodoPago;
  nota?: string | null;
}

export interface Reparacion {
  id: number;
  descripcion: string;
  problemaReportado?: string | null;
  diagnostico?: string | null;
  trabajosRealizados?: string | null;
  fechaEntrada: string;
  fechaSalida?: string | null;
  estado: EstadoReparacion;
  costoManoObra: number;
  vehiculoId: number;
  mecanicoId?: number | null;
  recepcionistaId: number;
  vehiculo?: Vehiculo;
  mecanico?: Mecanico;
  servicios?: ReparacionServicio[];
  ubicacionId?: number | null;
  ubicacion?: Ubicacion;
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
  pagos?: Pago[];
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
    plan?: string;
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
