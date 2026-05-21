import api from './axios';
import type { Reparacion } from '../types';

export const getReparaciones = () => api.get<Reparacion[]>('/reparaciones');
export const getReparacion = (id: number) => api.get<Reparacion>(`/reparaciones/${id}`);
export const createReparacion = (data: Partial<Reparacion>) => api.post<Reparacion>('/reparaciones', data);
export const updateReparacion = (id: number, data: Partial<Reparacion>) =>
  api.put<Reparacion>(`/reparaciones/${id}`, data);
export const deleteReparacion = (id: number) => api.delete(`/reparaciones/${id}`);
export const cambiarEstado = (id: number, estado: string) => api.patch(`/reparaciones/${id}/estado`, { estado });
export const asignarMecanico = (id: number, mecanicoId: number) =>
  api.patch(`/reparaciones/${id}/mecanico`, { mecanicoId });
export const registrarSalida = (id: number) => api.patch(`/reparaciones/${id}/salida`);
