import { Request, Response } from 'express';
import { ReparacionService } from '../../application/reparacionService';
import { EstadoReparacion } from '../../domain/entities/reparacion';

export class ReparacionController {
  constructor(private readonly reparacionService: ReparacionService) {}

  async getAll(req: Request, res: Response) {
    try {
      const reparaciones = await this.reparacionService.getAllReparaciones();
      res.status(200).json(reparaciones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las reparaciones' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const reparacion = await this.reparacionService.getReparacionById(id);
      
      if (reparacion) {
        res.status(200).json(reparacion);
      } else {
        res.status(404).json({ error: 'Reparación no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la reparación' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const reparacion = await this.reparacionService.createReparacion(req.body);
      res.status(201).json(reparacion);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la reparación' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const reparacion = await this.reparacionService.updateReparacion(id, req.body);
      
      if (reparacion) {
        res.status(200).json(reparacion);
      } else {
        res.status(404).json({ error: 'Reparación no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la reparación' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await this.reparacionService.deleteReparacion(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la reparación' });
    }
  }

  async cambiarEstado(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { estado } = req.body;
      
      if (!this.isEstadoValido(estado)) {
        return res.status(400).json({ error: 'Estado inválido' });
      }

      const reparacion = await this.reparacionService.cambiarEstadoReparacion(id, estado);
      
      if (reparacion) {
        res.status(200).json(reparacion);
      } else {
        res.status(404).json({ error: 'Reparación no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al cambiar el estado' });
    }
  }

  async asignarMecanico(req: Request, res: Response) {
    try {
      const reparacionId = parseInt(req.params.id);
      const { mecanicoId } = req.body;
      
      if (!mecanicoId) {
        return res.status(400).json({ error: 'ID de mecánico es requerido' });
      }

      const reparacion = await this.reparacionService.asignarMecanico(reparacionId, mecanicoId);
      
      if (reparacion) {
        res.status(200).json(reparacion);
      } else {
        res.status(404).json({ error: 'Reparación no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al asignar mecánico' });
    }
  }

  async registrarSalida(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const fechaSalida = new Date();
      
      const reparacion = await this.reparacionService.registrarSalida(id, fechaSalida);
      
      if (reparacion) {
        res.status(200).json(reparacion);
      } else {
        res.status(404).json({ error: 'Reparación no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al registrar salida' });
    }
  }

  async getDetalles(req: Request, res: Response) {
    try {
      const reparacionId = parseInt(req.params.id);
      const detalles = await this.reparacionService.getDetallesReparacion(reparacionId);
      res.status(200).json(detalles);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener detalles' });
    }
  }

  async getByVehiculo(req: Request, res: Response) {
    try {
      const vehiculoId = parseInt(req.params.vehiculoId);
      const reparaciones = await this.reparacionService.getReparacionesPorVehiculo(vehiculoId);
      res.status(200).json(reparaciones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener reparaciones por vehículo' });
    }
  }

  async getByMecanico(req: Request, res: Response) {
    try {
      const mecanicoId = parseInt(req.params.mecanicoId);
      const reparaciones = await this.reparacionService.getReparacionesPorMecanico(mecanicoId);
      res.status(200).json(reparaciones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener reparaciones por mecánico' });
    }
  }

  async getByRecepcionista(req: Request, res: Response) {
    try {
      const usuarioId = parseInt(req.params.usuarioId);
      const reparaciones = await this.reparacionService.getReparacionesPorRecepcionista(usuarioId);
      res.status(200).json(reparaciones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener reparaciones por recepcionista' });
    }
  }

  private isEstadoValido(estado: string): estado is EstadoReparacion {
    return ['EN_REVISION', 'EN_REPARACION', 'TERMINADO', 'ENTREGADO'].includes(estado);
  }
}