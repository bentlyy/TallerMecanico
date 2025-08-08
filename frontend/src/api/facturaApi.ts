import axios from './axios'; // tu instancia axios con baseURL

import { Factura, CreateFactura } from '../types';

const endpoint = '/facturas';

export const getFacturas = async (): Promise<Factura[]> => {
  const { data } = await axios.get(endpoint);
  return data;
};

export const getFacturaById = async (id: number): Promise<Factura> => {
  const { data } = await axios.get(`${endpoint}/${id}`);
  return data;
};

export const createFactura = async (factura: CreateFactura): Promise<Factura> => {
  const { data } = await axios.post(endpoint, factura);
  return data;
};

// Opcional: listar facturas por cliente o reparación si quieres esos filtros:
export const getFacturasByCliente = async (clienteId: number): Promise<Factura[]> => {
  const { data } = await axios.get(`${endpoint}/cliente/${clienteId}`);
  return data;
};

export const getFacturaByReparacion = async (reparacionId: number): Promise<Factura> => {
  const { data } = await axios.get(`${endpoint}/reparacion/${reparacionId}`);
  return data;
};
