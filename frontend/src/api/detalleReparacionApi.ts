import api from './axios';
import type { DetalleReparacion } from '../types';

export const getDetalles = (reparacionId: number) =>
  api.get<DetalleReparacion[]>(`/detalle-reparacion/${reparacionId}`);
export const addDetalle = (data: DetalleReparacion) => api.post('/detalle-reparacion', data);
export const updateDetalle = (reparacionId: number, piezaId: number, data: Partial<DetalleReparacion>) =>
  api.put(`/detalle-reparacion/${reparacionId}/${piezaId}`, data);
export const removeDetalle = (reparacionId: number, piezaId: number) =>
  api.delete(`/detalle-reparacion/${reparacionId}/${piezaId}`);
export const calcularTotal = (reparacionId: number) =>
  api.get<{ total: number }>(`/detalle-reparacion/${reparacionId}/total`);
