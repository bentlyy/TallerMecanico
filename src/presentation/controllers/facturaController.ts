import { Response } from 'express';
import { AuthRequest } from '../../infrastructure/http/authMiddleware';
import { FacturaService } from '../../application/facturaService';
import { asyncHandler } from '../../infrastructure/http/asyncHandler';
import { NotFoundError } from '../../infrastructure/http/errors';

export class FacturaController {
  constructor(private readonly facturaService: FacturaService) {}

  getAll = asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await this.facturaService.getAllFacturas(page, limit);
    res.json(result);
  });

  getById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const factura = await this.facturaService.getFacturaById(id);
    if (!factura) throw new NotFoundError('Factura');
    res.json(factura);
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const factura = await this.facturaService.createFactura(req.body);
    res.status(201).json(factura);
  });

  getByCliente = asyncHandler(async (req: AuthRequest, res: Response) => {
    const clienteId = parseInt(req.params.clienteId);
    const facturas = await this.facturaService.getFacturasPorCliente(clienteId);
    res.json(facturas);
  });

  getByReparacion = asyncHandler(async (req: AuthRequest, res: Response) => {
    const reparacionId = parseInt(req.params.reparacionId);
    const factura = await this.facturaService.getFacturasPorReparacion(reparacionId);
    if (!factura) throw new NotFoundError('Factura no encontrada para esta reparación');
    res.json(factura);
  });
}
