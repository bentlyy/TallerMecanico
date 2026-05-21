import api from "./axios";
import { Factura, CreateFactura } from "../types";

export const getFacturas = async (): Promise<Factura[]> => {
  const res = await api.get("/facturas");
  return res.data;
};

export const getFacturaById = async (id: number): Promise<Factura> => {
  const res = await api.get(`/facturas/${id}`);
  return res.data;
};

export const createFactura = async (factura: CreateFactura): Promise<Factura> => {
  const res = await api.post("/facturas", factura);
  return res.data;
};

export const deleteFactura = async (id: number): Promise<void> => {
  await api.delete(`/facturas/${id}`);
};
