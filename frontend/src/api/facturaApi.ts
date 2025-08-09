import axios from "axios";
import { Factura, CreateFactura } from "../types";

const API_URL = "/api/facturas";

export const getFacturas = async (): Promise<Factura[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const getFacturaById = async (id: number): Promise<Factura> => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const createFactura = async (factura: CreateFactura): Promise<Factura> => {
  const res = await axios.post(API_URL, factura);
  return res.data;
};

export const updateFactura = async (
  id: number,
  factura: CreateFactura
): Promise<Factura> => {
  const res = await axios.put(`${API_URL}/${id}`, factura);
  return res.data;
};

export const deleteFactura = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
