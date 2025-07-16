import { Request, Response } from "express";
import { DetalleReparacionService } from "../../application/detalleReparacionService";

export class DetalleReparacionController {
  constructor(private service: DetalleReparacionService) {}

  getByReparacion = async (req: Request, res: Response) => {
    const reparacionId = parseInt(req.params.reparacionId);
    const detalles = await this.service.obtenerPorReparacion(reparacionId);
    res.json(detalles);
  };

  add = async (req: Request, res: Response) => {
    const detalle = await this.service.agregarDetalle(req.body);
    res.status(201).json(detalle);
  };

  update = async (req: Request, res: Response) => {
    const { reparacionId, piezaId } = req.params;
    const updated = await this.service.actualizarDetalle(parseInt(reparacionId), parseInt(piezaId), req.body);
    updated ? res.json(updated) : res.status(404).json({ error: "Detalle no encontrado" });
  };

  delete = async (req: Request, res: Response) => {
    const { reparacionId, piezaId } = req.params;
    await this.service.eliminarDetalle(parseInt(reparacionId), parseInt(piezaId));
    res.status(204).send();
  };
}
