import api from './axios';

const BASE_URL = '/roles';

export const getAllRoles = () => api.get(BASE_URL);
export const getRolById = (id: number) => api.get(`${BASE_URL}/${id}`);
export const createRol = (data: any) => api.post(BASE_URL, data);
export const updateRol = (id: number, data: any) => api.put(`${BASE_URL}/${id}`, data);
export const deleteRol = (id: number) => api.delete(`${BASE_URL}/${id}`);
export const getPermisosDeRol = (rolId: number) => api.get(`${BASE_URL}/${rolId}/permisos`);