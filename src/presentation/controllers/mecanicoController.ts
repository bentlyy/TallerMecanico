// src/presentation/controllers/mecanicoController.ts
import { Request, Response } from 'express';
import { MecanicoService } from '../../application/mecanicoService';
import { UpdateMecanico } from '../../domain/entities/mecanico';

export class MecanicoController {
  constructor(private readonly mecanicoService: MecanicoService) {}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const mecanicos = await this.mecanicoService.getAll();
      res.json(mecanicos);
    } catch (error) {
      console.error('Error en MecanicoController.getAll:', error);
      res.status(500).json({ error: 'Error al obtener los mecánicos' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }

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

      if (typeof usuarioId !== 'number' || isNaN(usuarioId)) {
        res.status(400).json({ error: 'El ID de usuario es inválido o no fue proporcionado' });
        return;
      }

      const nuevoMecanico = await this.mecanicoService.createMecanico({
        usuarioId,
        especialidad: typeof especialidad === 'string' ? especialidad : null
      });

      res.status(201).json(nuevoMecanico);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error al crear el mecánico' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }

      const data: UpdateMecanico = req.body;

      if (data.usuarioId && typeof data.usuarioId !== 'number') {
        res.status(400).json({ error: 'usuarioId debe ser un número' });
        return;
      }

      const mecanicoActualizado = await this.mecanicoService.updateMecanico(id, data);

      if (mecanicoActualizado) {
        res.status(200).json(mecanicoActualizado);
      } else {
        res.status(404).json({ error: 'Mecánico no encontrado' });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error al actualizar el mecánico' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }

      await this.mecanicoService.deleteMecanico(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el mecánico' });
    }
  }
}
