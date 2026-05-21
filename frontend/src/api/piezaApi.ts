import api from './axios';
import type { Pieza } from '../types';

export const getPiezas = () => api.get<Pieza[]>('/piezas');
export const getPieza = (id: number) => api.get<Pieza>(`/piezas/${id}`);
export const createPieza = (data: Partial<Pieza>) => api.post<Pieza>('/piezas', data);
export const updatePieza = (id: number, data: Partial<Pieza>) => api.put<Pieza>(`/piezas/${id}`, data);
export const deletePieza = (id: number) => api.delete(`/piezas/${id}`);
export const updateStock = (id: number, stock: number) => api.patch(`/piezas/${id}/stock`, { stock });
