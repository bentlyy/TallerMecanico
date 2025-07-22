//vehiculoApi.ts
import api from './axios';

const BASE_URL = '/vehiculos';

export const getAllVehiculos = () => api.get(BASE_URL);
export const getVehiculoById = (id: number) => api.get(`${BASE_URL}/${id}`);
export const createVehiculo = (data: any) => api.post(BASE_URL, data);
export const updateVehiculo = (id: number, data: any) => api.put(`${BASE_URL}/${id}`, data);
export const deleteVehiculo = (id: number) => api.delete(`${BASE_URL}/${id}`);
export const getVehiculosPorCliente = (clienteId: number) => api.get(`${BASE_URL}/cliente/${clienteId}`);
export const getReparacionesPorVehiculo = (vehiculoId: number) => api.get(`${BASE_URL}/${vehiculoId}/reparaciones`);