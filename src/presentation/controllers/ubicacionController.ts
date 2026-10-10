import { Response } from 'express';
import { AuthRequest } from '../../infrastructure/http/authMiddleware';
import { UbicacionService } from '../../application/ubicacionService';
import { asyncHandler } from '../../infrastructure/http/asyncHandler';
import { NotFoundError } from '../../infrastructure/http/errors';

export class UbicacionController {
  constructor(private readonly ubicacionService: UbicacionService) {}

  getAll = asyncHandler(async (req: AuthRequest, res: Response) => {
    const empresaId = req.usuario!.empresaId;
    const includeInactive = req.query.includeInactive === 'true';
    const ubicaciones = await this.ubicacionService.getAllUbicaciones(empresaId, includeInactive);
    res.json(ubicaciones);
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const empresaId = req.usuario!.empresaId;
    const ubicacion = await this.ubicacionService.createUbicacion({ ...req.body, empresaId });
    res.status(201).json(ubicacion);
  });

  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const empresaId = req.usuario!.empresaId;
    const ubicacion = await this.ubicacionService.updateUbicacion(id, req.body, empresaId);
    if (!ubicacion) throw new NotFoundError('Ubicación');
    res.json(ubicacion);
  });

  delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    await this.ubicacionService.deleteUbicacion(id);
    res.sendStatus(204);
  });

  getHistorial = asyncHandler(async (req: AuthRequest, res: Response) => {
    const reparacionId = parseInt(req.params.id);
    const movimientos = await this.ubicacionService.getHistorial(reparacionId);
    res.json(movimientos);
  });

  mover = asyncHandler(async (req: AuthRequest, res: Response) => {
    const reparacionId = parseInt(req.params.id);
    const { ubicacionId, nota } = req.body;
    const usuarioId = req.usuario!.id;
    const movimiento = await this.ubicacionService.moverReparacion(reparacionId, ubicacionId ?? null, usuarioId, nota);
    res.status(201).json(movimiento);
  });
}
