import { Request, Response } from 'express';
import { DetalleReparacionService } from '../../application/detalleReparacionService';

export class DetalleReparacionController {
  constructor(private readonly detalleService: DetalleReparacionService) {}

  async agregar(req: Request, res: Response) {
    try {
      const reparacionId = parseInt(req.params.reparacionId);
      const { piezaId, cantidad, precioUnitario } = req.body;
      
      if (!piezaId || !cantidad || !precioUnitario) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
      }
      
      const detalle = await this.detalleService.agregarDetalle(
        reparacionId,
        piezaId,
        cantidad,
        precioUnitario
      );
      
      res.status(201).json(detalle);
    } catch (error) {
      res.status(500).json({ error: 'Error al agregar detalle' });
    }
  }

  async eliminar(req: Request, res: Response) {
    try {
      const reparacionId = parseInt(req.params.reparacionId);
      const piezaId = parseInt(req.params.piezaId);
      
      await this.detalleService.eliminarDetalle(reparacionId, piezaId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar detalle' });
    }
  }

  async actualizar(req: Request, res: Response) {
    try {
      const reparacionId = parseInt(req.params.reparacionId);
      const piezaId = parseInt(req.params.piezaId);
      
      const detalle = await this.detalleService.actualizarDetalle(
        reparacionId,
        piezaId,
        req.body
      );
      
      if (detalle) {
        res.status(200).json(detalle);
      } else {
        res.status(404).json({ error: 'Detalle no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar detalle' });
    }
  }

  async getDetalles(req: Request, res: Response) {
    try {
      const reparacionId = parseInt(req.params.reparacionId);
      const detalles = await this.detalleService.getDetallesDeReparacion(reparacionId);
      res.status(200).json(detalles);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener detalles' });
    }
  }

  async calcularTotal(req: Request, res: Response) {
    try {
      const reparacionId = parseInt(req.params.reparacionId);
      const total = await this.detalleService.calcularTotalRepuestos(reparacionId);
      res.status(200).json({ total });
    } catch (error) {
      res.status(500).json({ error: 'Error al calcular total' });
    }
  }
}