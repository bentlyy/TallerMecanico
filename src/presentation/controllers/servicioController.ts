import { Response } from 'express';
import { AuthRequest } from '../../infrastructure/http/authMiddleware';
import { ServicioService } from '../../application/servicioService';
import { asyncHandler } from '../../infrastructure/http/asyncHandler';
import { NotFoundError } from '../../infrastructure/http/errors';

export class ServicioController {
  constructor(private readonly servicioService: ServicioService) {}

  getAll = asyncHandler(async (req: AuthRequest, res: Response) => {
    const empresaId = req.usuario!.empresaId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const result = await this.servicioService.getAllServicios(empresaId, page, limit);
    res.json(result);
  });

  getById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const servicio = await this.servicioService.getServicioById(id);
    if (!servicio) throw new NotFoundError('Servicio');
    res.json(servicio);
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const empresaId = req.usuario!.empresaId;
    const servicio = await this.servicioService.createServicio({ ...req.body, empresaId });
    res.status(201).json(servicio);
  });

  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const empresaId = req.usuario!.empresaId;
    const servicio = await this.servicioService.updateServicio(id, req.body, empresaId);
    if (!servicio) throw new NotFoundError('Servicio');
    res.json(servicio);
  });

  delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    await this.servicioService.deleteServicio(id);
    res.sendStatus(204);
  });
}
