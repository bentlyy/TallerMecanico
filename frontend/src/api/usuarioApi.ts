import api from './axios';

const BASE_URL = '/usuarios';

export const getAllUsuarios = () => api.get(BASE_URL);
export const getUsuarioById = (id: number) => api.get(`${BASE_URL}/${id}`);
export const getUsuarioByEmail = (email: string) => api.get(`${BASE_URL}/email/${email}`);
export const createUsuario = (data: any) => api.post(BASE_URL, data);
export const updateUsuario = (id: number, data: any) => api.put(`${BASE_URL}/${id}`, data);
export const deleteUsuario = (id: number) => api.delete(`${BASE_URL}/${id}`);
export const activarUsuario = (id: number) => api.patch(`${BASE_URL}/${id}/activar`);
export const desactivarUsuario = (id: number) => api.patch(`${BASE_URL}/${id}/desactivar`);
export const getUsuariosPorRol = (rolId: number) => api.get(`${BASE_URL}/rol/${rolId}`);
export const verReparacionesAsignadasComoRecepcionista = (usuarioId: number) => 
  api.get(`${BASE_URL}/${usuarioId}/reparaciones`);
export const autenticar = (email: string, password: string) => 
  api.post(`${BASE_URL}/auth`, { email, password });