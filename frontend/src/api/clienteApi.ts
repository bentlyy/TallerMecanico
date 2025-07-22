//clienteApi.ts
import api from './axios';

const BASE_URL = '/clientes';

export const getAllClientes = () => api.get(BASE_URL);
export const getClienteById = (id: number) => api.get(`${BASE_URL}/${id}`);
export const getClienteByEmail = (email: string) => api.get(`${BASE_URL}/email/${email}`);
export const createCliente = (data: any) => api.post(BASE_URL, data);
export const updateCliente = (id: number, data: any) => api.put(`${BASE_URL}/${id}`, data);
export const deleteCliente = (id: number) => api.delete(`${BASE_URL}/${id}`);
export const getVehiculosPorCliente = (clienteId: number) => api.get(`${BASE_URL}/${clienteId}/vehiculos`);
export const getFacturasPorCliente = (clienteId: number) => api.get(`${BASE_URL}/${clienteId}/facturas`);