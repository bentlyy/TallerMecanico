import { Request, Response } from "express";
import { PiezaService } from "../../application/piezaService";

export class PiezaController {
  constructor(private piezaService: PiezaService) {}

  getAll = async (_req: Request, res: Response) => {
    const piezas = await this.piezaService.listarPiezas();
    res.json(piezas);
  };

  getById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const pieza = await this.piezaService.obtenerPieza(id);
    pieza ? res.json(pieza) : res.status(404).json({ error: "Pieza no encontrada" });
  };

  create = async (req: Request, res: Response) => {
    const nueva = await this.piezaService.crearPieza(req.body);
    res.status(201).json(nueva);
  };

  update = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const actualizada = await this.piezaService.actualizarPieza(id, req.body);
    actualizada ? res.json(actualizada) : res.status(404).json({ error: "Pieza no encontrada" });
  };

  delete = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    await this.piezaService.eliminarPieza(id);
    res.status(204).send();
  };
}
