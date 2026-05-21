import { Response } from 'express';
import { AuthRequest } from '../../infrastructure/http/authMiddleware';
import { DetalleReparacionService } from '../../application/detalleReparacionService';
import { asyncHandler } from '../../infrastructure/http/asyncHandler';

export class DetalleReparacionController {
  constructor(private readonly detalleService: DetalleReparacionService) {}

  agregarDetalle = asyncHandler(async (req: AuthRequest, res: Response) => {
    const detalle = await this.detalleService.agregarDetalle(req.body);
    res.status(201).json(detalle);
  });

  eliminarDetalle = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { reparacionId, piezaId } = req.params;
    const result = await this.detalleService.eliminarDetalle(Number(reparacionId), Number(piezaId));
    res.json({ success: result });
  });

  actualizarDetalle = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { reparacionId, piezaId } = req.params;
    const detalle = await this.detalleService.actualizarDetalle(Number(reparacionId), Number(piezaId), req.body);
    res.json(detalle);
  });

  getDetallesDeReparacion = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { reparacionId } = req.params;
    const detalles = await this.detalleService.getDetallesDeReparacion(Number(reparacionId));
    res.json(detalles);
  });

  calcularTotalRepuestos = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { reparacionId } = req.params;
    const total = await this.detalleService.calcularTotalRepuestos(Number(reparacionId));
    res.json({ total });
  });
}
