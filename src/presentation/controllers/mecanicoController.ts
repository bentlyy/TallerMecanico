import { Request, Response } from 'express';
import { MecanicoService } from '../../application/mecanicoService';

export class MecanicoController {
  constructor(private readonly mecanicoService: MecanicoService) {}

  async getAll(req: Request, res: Response) {
    try {
      const mecanicos = await this.mecanicoService.getAllMecanicos();
      res.status(200).json(mecanicos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los mecánicos' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const mecanico = await this.mecanicoService.getMecanicoById(id);
      
      if (mecanico) {
        res.status(200).json(mecanico);
      } else {
        res.status(404).json({ error: 'Mecánico no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el mecánico' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { usuarioId, especialidad } = req.body;
      const mecanico = await this.mecanicoService.createMecanico(usuarioId, especialidad);
      res.status(201).json(mecanico);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el mecánico' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const mecanico = await this.mecanicoService.updateMecanico(id, req.body);
      
      if (mecanico) {
        res.status(200).json(mecanico);
      } else {
        res.status(404).json({ error: 'Mecánico no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el mecánico' });
    }
  }

  async getReparaciones(req: Request, res: Response) {
    try {
      const mecanicoId = parseInt(req.params.mecanicoId);
      const reparaciones = await this.mecanicoService.getReparacionesAsignadas(mecanicoId);
      res.status(200).json(reparaciones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las reparaciones' });
    }
  }
}