import { Request, Response } from 'express';
import { MecanicoService } from '../../application/mecanicoService';
import { mecanicoService } from '../../infrastructure/di/container';
import { Mecanico, CreateMecanico, UpdateMecanico } from '../../domain/entities/mecanico';

export class MecanicoController {
  constructor(private readonly mecanicoService: MecanicoService) {}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const mecanicos = await this.mecanicoService.getAllMecanicos();
      res.status(200).json(mecanicos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los mecánicos' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
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

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { usuarioId, especialidad } = req.body;
      
      if (!usuarioId) {
        res.status(400).json({ error: 'El ID de usuario es requerido' });
        return;
      }

      const nuevoMecanico = await this.mecanicoService.createMecanico({
        usuarioId: parseInt(usuarioId),
        especialidad
      });
      
      res.status(201).json(nuevoMecanico);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const data: UpdateMecanico = req.body;
      
      const mecanicoActualizado = await this.mecanicoService.updateMecanico(id, data);
      
      if (mecanicoActualizado) {
        res.status(200).json(mecanicoActualizado);
      } else {
        res.status(404).json({ error: 'Mecánico no encontrado' });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.mecanicoService.deleteMecanico(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el mecánico' });
    }
  }
}

export const mecanicoController = new MecanicoController(mecanicoService);