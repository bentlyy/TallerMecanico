import api from './axios';

export const getAllMecanicos = () => api.get('/mecanicos');
export const getMecanicoById = (id: number) => api.get(`/mecanicos/${id}`);
export const createMecanico = (data: any) => api.post('/mecanicos', data);
export const updateMecanico = (id: number, data: any) => api.put(`/mecanicos/${id}`, data);
export const deleteMecanico = (id: number) => api.delete(`/mecanicos/${id}`);
