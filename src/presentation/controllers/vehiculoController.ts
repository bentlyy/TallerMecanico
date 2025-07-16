import { Request, Response } from "express";
import { VehiculoService } from "../../application/vehiculoService";

export class VehiculoController {
  constructor(private vehiculoService: VehiculoService) {}

  getAll = async (_req: Request, res: Response) => {
    const vehiculos = await this.vehiculoService.listarVehiculos();
    res.json(vehiculos);
  };

  getById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const vehiculo = await this.vehiculoService.obtenerVehiculo(id);
    vehiculo ? res.json(vehiculo) : res.status(404).json({ error: "Vehículo no encontrado" });
  };

  create = async (req: Request, res: Response) => {
    const nuevoVehiculo = await this.vehiculoService.crearVehiculo(req.body);
    res.status(201).json(nuevoVehiculo);
  };

  update = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const vehiculoActualizado = await this.vehiculoService.actualizarVehiculo(id, req.body);
    vehiculoActualizado ? res.json(vehiculoActualizado) : res.status(404).json({ error: "Vehículo no encontrado" });
  };

  delete = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    await this.vehiculoService.eliminarVehiculo(id);
    res.status(204).send();
  };
}
