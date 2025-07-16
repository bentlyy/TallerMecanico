import { Request, Response } from 'express';
import { PiezaService } from '../../application/piezaService';

export class PiezaController {
  constructor(private readonly piezaService: PiezaService) {}

  async getAll(req: Request, res: Response) {
    try {
      const piezas = await this.piezaService.getAllPiezas();
      res.status(200).json(piezas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las piezas' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const pieza = await this.piezaService.getPiezaById(id);
      
      if (pieza) {
        res.status(200).json(pieza);
      } else {
        res.status(404).json({ error: 'Pieza no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la pieza' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const pieza = await this.piezaService.createPieza(req.body);
      res.status(201).json(pieza);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la pieza' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const pieza = await this.piezaService.updatePieza(id, req.body);
      
      if (pieza) {
        res.status(200).json(pieza);
      } else {
        res.status(404).json({ error: 'Pieza no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la pieza' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await this.piezaService.deletePieza(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la pieza' });
    }
  }

  async getByCodigo(req: Request, res: Response) {
    try {
      const { codigo } = req.query;
      if (!codigo || typeof codigo !== 'string') {
        return res.status(400).json({ error: 'Código es requerido' });
      }

      const pieza = await this.piezaService.getPiezaByCodigo(codigo);
      if (pieza) {
        res.status(200).json(pieza);
      } else {
        res.status(404).json({ error: 'Pieza no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar pieza por código' });
    }
  }

  async updateStock(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { cantidad } = req.body;
      
      if (typeof cantidad !== 'number') {
        return res.status(400).json({ error: 'Cantidad inválida' });
      }

      const pieza = await this.piezaService.actualizarStock(id, cantidad);
      
      if (pieza) {
        res.status(200).json(pieza);
      } else {
        res.status(404).json({ error: 'Pieza no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar stock' });
    }
  }

  async decreaseStock(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { cantidad } = req.body;
      
      if (typeof cantidad !== 'number' || cantidad <= 0) {
        return res.status(400).json({ error: 'Cantidad inválida' });
      }

      const pieza = await this.piezaService.descontarStock(id, cantidad);
      
      if (pieza) {
        res.status(200).json(pieza);
      } else {
        res.status(404).json({ error: 'Pieza no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al descontar stock' });
    }
  }
}