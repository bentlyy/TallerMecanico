import api from './axios';
import type { Factura, CreateFactura, Pago, MetodoPago } from '../types';

export const getFacturas = () => api.get<Factura[]>('/facturas');
export const getFactura = (id: number) => api.get<Factura>(`/facturas/${id}`);
export const createFactura = (data: CreateFactura) => api.post<Factura>('/facturas', data);
export const deleteFactura = (id: number) => api.delete(`/facturas/${id}`);
export const getFacturaByReparacion = (reparacionId: number) =>
  api.get<Factura>(`/facturas/reparacion/${reparacionId}`);

export const getPagos = (facturaId: number) => api.get<Pago[]>(`/facturas/${facturaId}/pagos`);
export const addPago = (facturaId: number, data: { monto: number; metodo: MetodoPago; nota?: string }) =>
  api.post<Factura>(`/facturas/${facturaId}/pagos`, data);
export const deletePago = (facturaId: number, pagoId: number) =>
  api.delete<Factura>(`/facturas/${facturaId}/pagos/${pagoId}`);
