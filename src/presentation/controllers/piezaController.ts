import { Request, Response } from 'express';
import { PiezaService } from '../../application/piezaService';
import { piezaService } from '../../infrastructure/di/container';
import { Pieza, CreatePieza, UpdatePieza } from '../../domain/entities/pieza';

export class PiezaController {
  constructor(private readonly piezaService: PiezaService) {}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const piezas = await this.piezaService.getAllPiezas();
      res.status(200).json(piezas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las piezas' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
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

  async getByCodigo(req: Request, res: Response): Promise<void> {
    try {
      const { codigo } = req.params;
      const pieza = await this.piezaService.getPiezaByCodigo(codigo);
      
      if (pieza) {
        res.status(200).json(pieza);
      } else {
        res.status(404).json({ error: 'Pieza no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la pieza' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, marca, precio, stock, codigo } = req.body;
      
      if (!nombre || !precio || !codigo) {
        res.status(400).json({ error: 'Nombre, precio y código son requeridos' });
        return;
      }

      const nuevaPieza = await this.piezaService.createPieza({
        nombre,
        marca: marca || null,
        precio: parseFloat(precio),
        stock: stock ? parseInt(stock) : 0,
        codigo
      });
      
      res.status(201).json(nuevaPieza);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const data: UpdatePieza = req.body;
      
      if (data.precio) {
        data.precio = parseFloat(data.precio.toString());
      }
      
      if (data.stock) {
        data.stock = parseInt(data.stock.toString());
      }

      const piezaActualizada = await this.piezaService.updatePieza(id, data);
      
      if (piezaActualizada) {
        res.status(200).json(piezaActualizada);
      } else {
        res.status(404).json({ error: 'Pieza no encontrada' });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.piezaService.deletePieza(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la pieza' });
    }
  }

  async updateStock(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { cantidad } = req.body;
      
      if (typeof cantidad !== 'number') {
        res.status(400).json({ error: 'Cantidad debe ser un número' });
        return;
      }

      const pieza = await this.piezaService.updateStock(id, cantidad);
      
      if (pieza) {
        res.status(200).json(pieza);
      } else {
        res.status(404).json({ error: 'Pieza no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar stock' });
    }
  }
}

export const piezaController = new PiezaController(piezaService);