import { Response } from 'express';
import { AuthRequest } from '../../infrastructure/http/authMiddleware';
import { PiezaService } from '../../application/piezaService';
import { asyncHandler } from '../../infrastructure/http/asyncHandler';
import { NotFoundError } from '../../infrastructure/http/errors';

export class PiezaController {
  constructor(private readonly piezaService: PiezaService) {}

  getAll = asyncHandler(async (req: AuthRequest, res: Response) => {
    const empresaId = req.usuario!.empresaId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await this.piezaService.getAllPiezas(empresaId, page, limit);
    res.json(result);
  });

  getById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const pieza = await this.piezaService.getPiezaById(id);
    if (!pieza) throw new NotFoundError('Pieza');
    res.json(pieza);
  });

  getByCodigo = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { codigo } = req.params;
    const empresaId = req.usuario!.empresaId;
    const pieza = await this.piezaService.getPiezaByCodigo(codigo, empresaId);
    if (!pieza) throw new NotFoundError('Pieza');
    res.json(pieza);
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const empresaId = req.usuario!.empresaId;
    const nuevaPieza = await this.piezaService.createPieza({ ...req.body, empresaId });
    res.status(201).json(nuevaPieza);
  });

  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const empresaId = req.usuario!.empresaId;
    const piezaActualizada = await this.piezaService.updatePieza(id, req.body, empresaId);
    if (!piezaActualizada) throw new NotFoundError('Pieza');
    res.json(piezaActualizada);
  });

  delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    await this.piezaService.deletePieza(id);
    res.sendStatus(204);
  });

  updateStock = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const { cantidad } = req.body;
    if (typeof cantidad !== 'number') {
      res.status(400).json({ error: 'Cantidad debe ser un número' });
      return;
    }
    const pieza = await this.piezaService.updateStock(id, cantidad);
    if (!pieza) throw new NotFoundError('Pieza');
    res.json(pieza);
  });
}
