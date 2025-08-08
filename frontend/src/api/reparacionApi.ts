// frontend/src/api/reparacionApi.ts
import api from './axios';

const BASE = '/reparaciones';

export const getAllReparaciones = () => api.get(BASE);
export const getReparacionById = (id: number) => api.get(`${BASE}/${id}`);
export const createReparacion = (data: any) => api.post(BASE, data);
export const updateReparacion = (id: number, data: any) => api.put(`${BASE}/${id}`, data);
export const deleteReparacion = (id: number) => api.delete(`${BASE}/${id}`);

export const cambiarEstado = (id: number, estado: string) => api.patch(`${BASE}/${id}/estado`, { estado });
export const asignarMecanico = (id: number, mecanicoId: number) => api.patch(`${BASE}/${id}/mecanico`, { mecanicoId });
export const registrarSalida = (id: number, fechaSalida: string) => api.patch(`${BASE}/${id}/salida`, { fechaSalida });

export const getReparacionesPorVehiculo = (vehiculoId: number) => api.get(`${BASE}/vehiculo/${vehiculoId}`);
export const getReparacionesPorMecanico = (mecanicoId: number) => api.get(`${BASE}/mecanico/${mecanicoId}`);
export const getReparacionesPorRecepcionista = (usuarioId: number) => api.get(`${BASE}/recepcionista/${usuarioId}`);
