import { Response } from 'express';
import { AuthRequest } from '../../infrastructure/http/authMiddleware';
import { MecanicoService } from '../../application/mecanicoService';
import { asyncHandler } from '../../infrastructure/http/asyncHandler';
import { NotFoundError } from '../../infrastructure/http/errors';

export class MecanicoController {
  constructor(private readonly mecanicoService: MecanicoService) {}

  getAll = asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await this.mecanicoService.getAll(page, limit);
    res.json(result);
  });

  getById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const mecanico = await this.mecanicoService.getMecanicoById(id);
    if (!mecanico) throw new NotFoundError('Mecánico');
    res.json(mecanico);
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const nuevoMecanico = await this.mecanicoService.createMecanico(req.body);
    res.status(201).json(nuevoMecanico);
  });

  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const mecanicoActualizado = await this.mecanicoService.updateMecanico(id, req.body);
    if (!mecanicoActualizado) throw new NotFoundError('Mecánico');
    res.json(mecanicoActualizado);
  });

  delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    await this.mecanicoService.deleteMecanico(id);
    res.sendStatus(204);
  });
}
