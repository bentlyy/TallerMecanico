import api from './axios';

const BASE_URL = '/facturas';

export const getAllFacturas = () => api.get(BASE_URL);
export const getFacturaById = (id: number) => api.get(`${BASE_URL}/${id}`);
export const createFactura = (data: any) => api.post(BASE_URL, data);
export const getFacturasPorCliente = (clienteId: number) => api.get(`${BASE_URL}/cliente/${clienteId}`);
export const getFacturasPorReparacion = (reparacionId: number) => api.get(`${BASE_URL}/reparacion/${reparacionId}`);
export const generarFactura = (reparacionId: number) => api.post(`${BASE_URL}/generar`, { reparacionId });