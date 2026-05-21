import api from './axios';
import type { Cliente } from '../types';

export const getClientes = () => api.get<Cliente[]>('/clientes');
export const getCliente = (id: number) => api.get<Cliente>(`/clientes/${id}`);
export const createCliente = (data: Partial<Cliente>) => api.post<Cliente>('/clientes', data);
export const updateCliente = (id: number, data: Partial<Cliente>) => api.put<Cliente>(`/clientes/${id}`, data);
export const deleteCliente = (id: number) => api.delete(`/clientes/${id}`);
