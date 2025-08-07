import api from './axios';

export const getAllRoles = () => api.get('/roles');
export const getRolById = (id: number) => api.get(`/roles/${id}`);
export const createRol = (data: { nombre: string; permisos: any }) => api.post('/roles', data);
export const updateRol = (id: number, data: { nombre?: string; permisos?: any }) => api.put(`/roles/${id}`, data);
export const deleteRol = (id: number) => api.delete(`/roles/${id}`);
