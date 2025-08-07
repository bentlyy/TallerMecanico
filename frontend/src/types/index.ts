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

