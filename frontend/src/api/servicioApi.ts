import api from './axios';
import type { Servicio } from '../types';

export const getServicios = () => api.get<Servicio[]>('/servicios');
export const getServicio = (id: number) => api.get<Servicio>(`/servicios/${id}`);
export const createServicio = (data: Partial<Servicio>) => api.post<Servicio>('/servicios', data);
export const updateServicio = (id: number, data: Partial<Servicio>) => api.put<Servicio>(`/servicios/${id}`, data);
export const deleteServicio = (id: number) => api.delete(`/servicios/${id}`);
