import api from './axios';

const BASE_URL = '/reparaciones';

export const getAllReparaciones = () => api.get(BASE_URL);
export const getReparacionById = (id: number) => api.get(`${BASE_URL}/${id}`);
export const createReparacion = (data: any) => api.post(BASE_URL, data);
export const updateReparacion = (id: number, data: any) => api.put(`${BASE_URL}/${id}`, data);
export const deleteReparacion = (id: number) => api.delete(`${BASE_URL}/${id}`);
export const cambiarEstadoReparacion = (id: number, estado: string) => api.patch(`${BASE_URL}/${id}/estado`, { estado });
export const asignarMecanico = (reparacionId: number, mecanicoId: number) => api.patch(`${BASE_URL}/${reparacionId}/mecanico`, { mecanicoId });
export const registrarSalida = (id: number, fechaSalida: string) => api.patch(`${BASE_URL}/${id}/salida`, { fechaSalida });
export const getDetallesReparacion = (reparacionId: number) => api.get(`${BASE_URL}/${reparacionId}/detalles`);
export const getReparacionesPorVehiculo = (vehiculoId: number) => api.get(`${BASE_URL}/vehiculo/${vehiculoId}`);
export const getReparacionesPorMecanico = (mecanicoId: number) => api.get(`${BASE_URL}/mecanico/${mecanicoId}`);
export const getReparacionesPorRecepcionista = (usuarioId: number) => api.get(`${BASE_URL}/recepcionista/${usuarioId}`);