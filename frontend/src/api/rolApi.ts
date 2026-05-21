import api from './axios';
import type { Rol } from '../types';

export const getRoles = () => api.get<Rol[]>('/roles');
export const getRol = (id: number) => api.get<Rol>(`/roles/${id}`);
export const createRol = (data: Partial<Rol>) => api.post<Rol>('/roles', data);
export const updateRol = (id: number, data: Partial<Rol>) => api.put<Rol>(`/roles/${id}`, data);
export const deleteRol = (id: number) => api.delete(`/roles/${id}`);
