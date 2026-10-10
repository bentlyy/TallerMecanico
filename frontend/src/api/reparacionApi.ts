import api from './axios';
import type { Reparacion, ReparacionServicio } from '../types';

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

export const getServiciosReparacion = (id: number) => api.get<ReparacionServicio[]>(`/reparaciones/${id}/servicios`);
export const addServicioReparacion = (id: number, servicioId: number, cantidad = 1) =>
  api.post<ReparacionServicio[]>(`/reparaciones/${id}/servicios`, { servicioId, cantidad });
export const updateServicioReparacion = (id: number, servicioId: number, cantidad: number) =>
  api.put<ReparacionServicio[]>(`/reparaciones/${id}/servicios/${servicioId}`, { cantidad });
export const removeServicioReparacion = (id: number, servicioId: number) =>
  api.delete<ReparacionServicio[]>(`/reparaciones/${id}/servicios/${servicioId}`);
