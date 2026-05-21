import api from './axios';
import type { Mecanico } from '../types';

export const getMecanicos = () => api.get<Mecanico[]>('/mecanicos');
export const getMecanico = (id: number) => api.get<Mecanico>(`/mecanicos/${id}`);
export const createMecanico = (data: Partial<Mecanico>) => api.post<Mecanico>('/mecanicos', data);
export const updateMecanico = (id: number, data: Partial<Mecanico>) => api.put<Mecanico>(`/mecanicos/${id}`, data);
export const deleteMecanico = (id: number) => api.delete(`/mecanicos/${id}`);
