import api from './axios';
import type { Usuario } from '../types';

export const getUsuarios = () => api.get<Usuario[]>('/usuarios');
export const getUsuario = (id: number) => api.get<Usuario>(`/usuarios/${id}`);
export const createUsuario = (data: Partial<Usuario> & { password: string }) => api.post<Usuario>('/usuarios', data);
export const updateUsuario = (id: number, data: Partial<Usuario>) => api.put<Usuario>(`/usuarios/${id}`, data);
export const deleteUsuario = (id: number) => api.delete(`/usuarios/${id}`);
export const activateUsuario = (id: number) => api.patch(`/usuarios/${id}/activate`);
export const deactivateUsuario = (id: number) => api.patch(`/usuarios/${id}/deactivate`);
