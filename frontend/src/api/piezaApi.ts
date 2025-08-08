// piezaApi.ts
import axios from './axios';
import { Pieza } from '../types';

const API_URL = '/piezas';

export const getPiezas = async (): Promise<Pieza[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const getPiezaById = async (id: number): Promise<Pieza> => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const createPieza = async (pieza: Omit<Pieza, 'id'>): Promise<Pieza> => {
  const res = await axios.post(API_URL, pieza);
  return res.data;
};

export const updatePieza = async (id: number, pieza: Partial<Pieza>): Promise<Pieza> => {
  const res = await axios.put(`${API_URL}/${id}`, pieza);
  return res.data;
};

export const deletePieza = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
