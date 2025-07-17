import api from './axios';

const BASE_URL = '/mecanicos';

export const getAllMecanicos = () => api.get(BASE_URL);
export const getMecanicoById = (id: number) => api.get(`${BASE_URL}/${id}`);
export const createMecanico = (usuarioId: number, especialidad: string) => 
  api.post(BASE_URL, { usuarioId, especialidad });
export const updateMecanico = (id: number, data: any) => api.put(`${BASE_URL}/${id}`, data);
export const getReparacionesAsignadas = (mecanicoId: number) => 
  api.get(`${BASE_URL}/${mecanicoId}/reparaciones`);