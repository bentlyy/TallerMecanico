import api from './axios';

const BASE_URL = '/detalle-reparacion';

export const agregarDetalle = (reparacionId: number, piezaId: number, cantidad: number, precioUnitario: number) => 
  api.post(BASE_URL, { reparacionId, piezaId, cantidad, precioUnitario });
export const eliminarDetalle = (reparacionId: number, piezaId: number) => 
  api.delete(`${BASE_URL}/${reparacionId}/${piezaId}`);
export const actualizarDetalle = (reparacionId: number, piezaId: number, data: any) => 
  api.patch(`${BASE_URL}/${reparacionId}/${piezaId}`, data);
export const getDetallesDeReparacion = (reparacionId: number) => 
  api.get(`${BASE_URL}/reparacion/${reparacionId}`);
export const calcularTotalRepuestos = (reparacionId: number) => 
  api.get(`${BASE_URL}/total/${reparacionId}`);