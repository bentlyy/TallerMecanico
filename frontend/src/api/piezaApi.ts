import api from './axios';

const BASE_URL = '/piezas';

export const getAllPiezas = () => api.get(BASE_URL);
export const getPiezaById = (id: number) => api.get(`${BASE_URL}/${id}`);
export const createPieza = (data: any) => api.post(BASE_URL, data);
export const updatePieza = (id: number, data: any) => api.put(`${BASE_URL}/${id}`, data);
export const deletePieza = (id: number) => api.delete(`${BASE_URL}/${id}`);
export const getPiezaByCodigo = (codigo: string) => api.get(`${BASE_URL}/codigo/${codigo}`);
export const actualizarStock = (id: number, nuevaCantidad: number) => 
  api.patch(`${BASE_URL}/${id}/stock`, { cantidad: nuevaCantidad });
export const descontarStock = (id: number, cantidad: number) => 
  api.patch(`${BASE_URL}/${id}/descontar`, { cantidad });