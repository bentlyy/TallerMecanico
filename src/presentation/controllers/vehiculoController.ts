import { Request, Response } from "express";
import { vehiculoService } from "../../infrastructure/di/container";

export const crearVehiculo = async (req: Request, res: Response) => {
  try {
    const vehiculo = await vehiculoService.crear(req.body);
    res.status(201).json(vehiculo);
  } catch (error) {
    res.status(500).json({ error: "Error al crear vehículo" });
  }
};

export const obtenerVehiculos = async (_: Request, res: Response) => {
  const vehiculos = await vehiculoService.listar();
  res.json(vehiculos);
};

export const obtenerPorCliente = async (req: Request, res: Response) => {
  const clienteId = parseInt(req.params.clienteId);
  const vehiculos = await vehiculoService.listarPorCliente(clienteId);
  res.json(vehiculos);
};
