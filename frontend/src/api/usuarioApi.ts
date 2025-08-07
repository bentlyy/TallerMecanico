import api from './axios';

export const getAllUsuarios = () => api.get('/usuarios');
export const getUsuarioById = (id: number) => api.get(`/usuarios/${id}`);
export const createUsuario = (data: any) => api.post('/usuarios', data);
export const updateUsuario = (id: number, data: any) => api.put(`/usuarios/${id}`, data);
export const deleteUsuario = (id: number) => api.delete(`/usuarios/${id}`);
