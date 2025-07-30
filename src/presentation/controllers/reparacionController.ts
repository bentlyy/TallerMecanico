import { Request, Response } from 'express';
import { ReparacionService } from '../../application/reparacionService';
import { EstadoReparacion } from '../../domain/entities/reparacion';

export class ReparacionController {
  constructor(private readonly service: ReparacionService) {}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const reparaciones = await this.service.getAllReparaciones();
      res.status(200).json(reparaciones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener reparaciones' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const reparacion = await this.service.getReparacionById(id);
      if (reparacion) {
        res.status(200).json(reparacion);
      } else {
        res.status(404).json({ error: 'Reparación no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la reparación' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { descripcion, vehiculoId, mecanicoId, recepcionistaId } = req.body;
      
      if (!descripcion || !vehiculoId || !recepcionistaId) {
        res.status(400).json({ error: 'Descripción, vehículo y recepcionista son requeridos' });
        return;
      }

      const nuevaReparacion = await this.service.createReparacion({
        descripcion,
        fechaEntrada: new Date(),
        fechaSalida: null,
        estado: EstadoReparacion.EN_REVISION,
        costoManoObra: 0, // Inicialmente 0
        vehiculoId: parseInt(vehiculoId),
        mecanicoId: mecanicoId ? parseInt(mecanicoId) : null,
        recepcionistaId: parseInt(recepcionistaId)
      });

      res.status(201).json(nuevaReparacion);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      const reparacion = await this.service.updateReparacion(id, data);
      if (reparacion) {
        res.status(200).json(reparacion);
      } else {
        res.status(404).json({ error: 'Reparación no encontrada' });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.service.deleteReparacion(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la reparación' });
    }
  }

  async cambiarEstado(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { estado } = req.body;
      if (!estado || !Object.values(EstadoReparacion).includes(estado)) {
        res.status(400).json({ error: 'Estado inválido' });
        return;
      }
      const reparacion = await this.service.cambiarEstadoReparacion(id, estado);
      if (reparacion) {
        res.status(200).json(reparacion);
      } else {
        res.status(404).json({ error: 'Reparación no encontrada' });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async asignarMecanico(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { mecanicoId } = req.body;
      const reparacion = await this.service.asignarMecanico(id, mecanicoId ? parseInt(mecanicoId) : null);
      if (reparacion) {
        res.status(200).json(reparacion);
      } else {
        res.status(404).json({ error: 'Reparación no encontrada' });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async registrarSalida(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { fechaSalida } = req.body;
      const fecha = fechaSalida ? new Date(fechaSalida) : new Date();
      const reparacion = await this.service.registrarSalida(id, fecha);
      if (reparacion) {
        res.status(200).json(reparacion);
      } else {
        res.status(404).json({ error: 'Reparación no encontrada' });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getDetalles(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const detalles = await this.service.getDetallesReparacion(id);
      res.status(200).json(detalles);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener detalles' });
    }
  }

  async getPorVehiculo(req: Request, res: Response): Promise<void> {
    try {
      const vehiculoId = parseInt(req.params.vehiculoId);
      const reparaciones = await this.service.getReparacionesPorVehiculo(vehiculoId);
      res.status(200).json(reparaciones);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getPorMecanico(req: Request, res: Response): Promise<void> {
    try {
      const mecanicoId = parseInt(req.params.mecanicoId);
      const reparaciones = await this.service.getReparacionesPorMecanico(mecanicoId);
      res.status(200).json(reparaciones);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getPorRecepcionista(req: Request, res: Response): Promise<void> {
    try {
      const usuarioId = parseInt(req.params.usuarioId);
      const reparaciones = await this.service.getReparacionesPorRecepcionista(usuarioId);
      res.status(200).json(reparaciones);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async addDetalle(req: Request, res: Response): Promise<void> {
    try {
      const reparacionId = parseInt(req.params.id);
      const { piezaId, cantidad } = req.body;
      
      if (!piezaId || !cantidad) {
        res.status(400).json({ error: 'Pieza y cantidad son requeridos' });
        return;
      }
      
      const detalle = await this.service.addDetalleReparacion(reparacionId, piezaId, cantidad);
      res.status(201).json(detalle);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async removeDetalle(req: Request, res: Response): Promise<void> {
    try {
      const reparacionId = parseInt(req.params.id);
      const piezaId = parseInt(req.params.piezaId);
      await this.service.removeDetalleReparacion(reparacionId, piezaId);
      res.status(204).end();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}