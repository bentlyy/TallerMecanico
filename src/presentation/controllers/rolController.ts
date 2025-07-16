import { Request, Response } from "express";
import { RolService } from "../../application/rolService";

export class RolController {
  constructor(private rolService: RolService) {}

  getAll = async (_req: Request, res: Response) => {
    const roles = await this.rolService.listarRoles();
    res.json(roles);
  };

  getById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const rol = await this.rolService.obtenerRol(id);
    rol ? res.json(rol) : res.status(404).json({ error: "Rol no encontrado" });
  };

  create = async (req: Request, res: Response) => {
    const nuevoRol = await this.rolService.crearRol(req.body);
    res.status(201).json(nuevoRol);
  };

  update = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const actualizado = await this.rolService.actualizarRol(id, req.body);
    actualizado ? res.json(actualizado) : res.status(404).json({ error: "Rol no encontrado" });
  };

  delete = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    await this.rolService.eliminarRol(id);
    res.status(204).send();
  };
}
