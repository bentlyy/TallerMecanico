import api from './axios';
import type { Ubicacion, MovimientoUbicacion } from '../types';

export const getUbicaciones = (includeInactive = false) =>
  api.get<Ubicacion[]>(`/ubicaciones${includeInactive ? '?includeInactive=true' : ''}`);
export const createUbicacion = (data: Partial<Ubicacion>) => api.post<Ubicacion>('/ubicaciones', data);
export const updateUbicacion = (id: number, data: Partial<Ubicacion>) => api.put<Ubicacion>(`/ubicaciones/${id}`, data);
export const deleteUbicacion = (id: number) => api.delete(`/ubicaciones/${id}`);

export const getHistorialUbicacion = (reparacionId: number) =>
  api.get<MovimientoUbicacion[]>(`/reparaciones/${reparacionId}/ubicaciones`);
export const moverReparacion = (reparacionId: number, ubicacionId: number | null, nota?: string | null) =>
  api.post<MovimientoUbicacion>(`/reparaciones/${reparacionId}/ubicacion`, { ubicacionId, nota });
