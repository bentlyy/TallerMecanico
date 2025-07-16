import { Request, Response } from "express";
import { MecanicoService } from "../../application/mecanicoService";

export class MecanicoController {
  constructor(private mecanicoService: MecanicoService) {}

  getAll = async (_req: Request, res: Response) => {
    const mecanicos = await this.mecanicoService.listarMecanicos();
    res.json(mecanicos);
  };

  getById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const mecanico = await this.mecanicoService.obtenerMecanico(id);
    mecanico ? res.json(mecanico) : res.status(404).json({ error: "Mecánico no encontrado" });
  };

  create = async (req: Request, res: Response) => {
    const nuevo = await this.mecanicoService.crearMecanico(req.body);
    res.status(201).json(nuevo);
  };

  update = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const actualizado = await this.mecanicoService.actualizarMecanico(id, req.body);
    actualizado ? res.json(actualizado) : res.status(404).json({ error: "Mecánico no encontrado" });
  };

  delete = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    await this.mecanicoService.eliminarMecanico(id);
    res.status(204).send();
  };
}
