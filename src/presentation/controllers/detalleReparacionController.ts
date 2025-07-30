import { Request, Response } from 'express';
import { DetalleReparacionService } from '../../application/detalleReparacionService';

export class DetalleReparacionController {
  constructor(private readonly service: DetalleReparacionService) {}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const detalles = await this.service.getAllDetalles();
      res.status(200).json(detalles);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los detalles de reparación' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const detalle = await this.service.getDetalleById(id);
      if (detalle) {
        res.status(200).json(detalle);
      } else {
        res.status(404).json({ error: 'Detalle no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el detalle' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { reparacionId, piezaId, cantidad } = req.body;
      
      if (!reparacionId || !piezaId || !cantidad) {
        res.status(400).json({ error: 'reparacionId, piezaId y cantidad son requeridos' });
        return;
      }

      const nuevoDetalle = await this.service.createDetalle({
        reparacionId: parseInt(reparacionId),
        piezaId: parseInt(piezaId),
        cantidad: parseInt(cantidad),
        precioUnitario: 0 // Se establecerá automáticamente en el servicio
      });

      res.status(201).json(nuevoDetalle);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      const detalleActualizado = await this.service.updateDetalle(id, data);
      if (detalleActualizado) {
        res.status(200).json(detalleActualizado);
      } else {
        res.status(404).json({ error: 'Detalle no encontrado' });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.service.deleteDetalle(id);
      res.status(204).end();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getByReparacion(req: Request, res: Response): Promise<void> {
    try {
      const reparacionId = parseInt(req.params.reparacionId);
      const detalles = await this.service.getDetallesPorReparacion(reparacionId);
      res.status(200).json(detalles);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getByPieza(req: Request, res: Response): Promise<void> {
    try {
      const piezaId = parseInt(req.params.piezaId);
      const detalles = await this.service.getDetallesPorPieza(piezaId);
      res.status(200).json(detalles);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateCantidad(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { cantidad } = req.body;
      
      if (!cantidad || cantidad <= 0) {
        res.status(400).json({ error: 'cantidad es requerida y debe ser mayor a cero' });
        return;
      }

      const detalleActualizado = await this.service.updateCantidadDetalle(id, cantidad);
      if (detalleActualizado) {
        res.status(200).json(detalleActualizado);
      } else {
        res.status(404).json({ error: 'Detalle no encontrado' });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}