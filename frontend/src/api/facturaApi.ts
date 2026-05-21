import api from './axios';
import type { Factura, CreateFactura } from '../types';

export const getFacturas = () => api.get<Factura[]>('/facturas');
export const getFactura = (id: number) => api.get<Factura>(`/facturas/${id}`);
export const createFactura = (data: CreateFactura) => api.post<Factura>('/facturas', data);
export const deleteFactura = (id: number) => api.delete(`/facturas/${id}`);
