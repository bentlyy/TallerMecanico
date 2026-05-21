import { Response } from 'express';
import { AuthRequest } from '../../infrastructure/http/authMiddleware';
import { RolService } from '../../application/rolService';
import { asyncHandler } from '../../infrastructure/http/asyncHandler';
import { NotFoundError } from '../../infrastructure/http/errors';

export class RolController {
  constructor(private readonly rolService: RolService) {}

  getAll = asyncHandler(async (req: AuthRequest, res: Response) => {
    const roles = await this.rolService.getAllRoles();
    res.json(roles);
  });

  getById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const rol = await this.rolService.getRolById(id);
    if (!rol) throw new NotFoundError('Rol');
    res.json(rol);
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const nuevoRol = await this.rolService.createRol(req.body);
    res.status(201).json(nuevoRol);
  });

  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const rolActualizado = await this.rolService.updateRol(id, req.body);
    if (!rolActualizado) throw new NotFoundError('Rol');
    res.json(rolActualizado);
  });

  delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    await this.rolService.deleteRol(id);
    res.sendStatus(204);
  });
}
