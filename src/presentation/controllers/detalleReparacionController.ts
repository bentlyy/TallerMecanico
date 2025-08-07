import { Request, Response } from 'express';
import { DetalleReparacionService } from '../../application/detalleReparacionService';
import { CreateDetalleReparacion, UpdateDetalleReparacion } from '../../domain/entities/detalleReparacion';

export class DetalleReparacionController {
  constructor(private readonly detalleService: DetalleReparacionService) {}

  async agregarDetalle(req: Request, res: Response) {
    try {
      const { reparacionId, piezaId, cantidad, precioUnitario } = req.body;
      const detalle = await this.detalleService.agregarDetalle({ reparacionId, piezaId, cantidad, precioUnitario });
      res.status(201).json(detalle);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async eliminarDetalle(req: Request, res: Response) {
    try {
      const { reparacionId, piezaId } = req.params;
      const result = await this.detalleService.eliminarDetalle(Number(reparacionId), Number(piezaId));
      res.status(200).json({ success: result });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async actualizarDetalle(req: Request, res: Response) {
    try {
      const { reparacionId, piezaId } = req.params;
      const data: UpdateDetalleReparacion = req.body;
      const detalle = await this.detalleService.actualizarDetalle(Number(reparacionId), Number(piezaId), data);
      res.status(200).json(detalle);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getDetallesDeReparacion(req: Request, res: Response) {
    try {
      const { reparacionId } = req.params;
      const detalles = await this.detalleService.getDetallesDeReparacion(Number(reparacionId));
      res.status(200).json(detalles);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async calcularTotalRepuestos(req: Request, res: Response) {
    try {
      const { reparacionId } = req.params;
      const total = await this.detalleService.calcularTotalRepuestos(Number(reparacionId));
      res.status(200).json({ total });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}