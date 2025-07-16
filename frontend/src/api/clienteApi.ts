// frontend/src/api/clienteApi.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/clientes';

export const getAllClientes = () => axios.get(API_URL);
export const getClienteById = (id: number) => axios.get(`${API_URL}/${id}`);
export const getClienteByEmail = (email: string) => axios.get(`${API_URL}/email?email=${email}`);
export const createCliente = (data: any) => axios.post(API_URL, data);
export const updateCliente = (id: number, data: any) => axios.put(`${API_URL}/${id}`, data);
export const deleteCliente = (id: number) => axios.delete(`${API_URL}/${id}`);
