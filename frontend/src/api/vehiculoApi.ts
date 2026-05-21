import api from './axios';
import type { Vehiculo } from '../types';

export const getVehiculos = () => api.get<Vehiculo[]>('/vehiculos');
export const getVehiculo = (id: number) => api.get<Vehiculo>(`/vehiculos/${id}`);
export const getVehiculosByCliente = (clienteId: number) => api.get<Vehiculo[]>(`/vehiculos/cliente/${clienteId}`);
export const createVehiculo = (data: Partial<Vehiculo>) => api.post<Vehiculo>('/vehiculos', data);
export const updateVehiculo = (id: number, data: Partial<Vehiculo>) => api.put<Vehiculo>(`/vehiculos/${id}`, data);
export const deleteVehiculo = (id: number) => api.delete(`/vehiculos/${id}`);
