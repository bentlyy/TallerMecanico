import { Request, Response } from "express";
import { ReparacionService } from "../../application/reparacionService";

export class ReparacionController {
  constructor(private service: ReparacionService) {}

  getAll = async (_req: Request, res: Response) => {
    const reparaciones = await this.service.listar();
    res.json(reparaciones);
  };

  getById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const r = await this.service.obtenerPorId(id);
    r ? res.json(r) : res.status(404).json({ error: "Reparación no encontrada" });
  };

  create = async (req: Request, res: Response) => {
    const nueva = await this.service.crear(req.body);
    res.status(201).json(nueva);
  };

  update = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const actualizada = await this.service.actualizar(id, req.body);
    actualizada ? res.json(actualizada) : res.status(404).json({ error: "No encontrada" });
  };

  delete = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    await this.service.eliminar(id);
    res.status(204).send();
  };
}
