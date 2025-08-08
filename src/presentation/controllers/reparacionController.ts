// src/presentation/controllers/reparacionController.ts
import { Request, Response } from 'express';
import { ReparacionService } from '../../application/reparacionService';
import { CreateReparacion, UpdateReparacion, EstadoReparacion } from '../../domain/entities/reparacion';

export class ReparacionController {
  constructor(private readonly reparacionService: ReparacionService) {}

  async getAll(req: Request, res: Response) {
    const data = await this.reparacionService.getAllReparaciones();
    res.json(data);
  }

  async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const data = await this.reparacionService.getReparacionById(id);
    data ? res.json(data) : res.status(404).json({ error: 'No encontrada' });
  }

  async create(req: Request, res: Response) {
    const data: CreateReparacion = req.body;
    const nueva = await this.reparacionService.createReparacion(data);
    res.status(201).json(nueva);
  }

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const data: UpdateReparacion = req.body;
    const updated = await this.reparacionService.updateReparacion(id, data);
    updated ? res.json(updated) : res.status(404).json({ error: 'No encontrada' });
  }

  async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    await this.reparacionService.deleteReparacion(id);
    res.status(204).send();
  }

  async cambiarEstado(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { estado } = req.body;
    const result = await this.reparacionService.cambiarEstadoReparacion(id, estado as EstadoReparacion);
    result ? res.json(result) : res.status(404).json({ error: 'No encontrada' });
  }

  async asignarMecanico(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { mecanicoId } = req.body;
    const result = await this.reparacionService.asignarMecanico(id, mecanicoId);
    result ? res.json(result) : res.status(404).json({ error: 'No encontrada' });
  }

  async registrarSalida(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { fechaSalida } = req.body;
    const result = await this.reparacionService.registrarSalida(id, new Date(fechaSalida));
    result ? res.json(result) : res.status(404).json({ error: 'No encontrada' });
  }

  async getPorVehiculo(req: Request, res: Response) {
    const vehiculoId = parseInt(req.params.vehiculoId);
    const rs = await this.reparacionService.getReparacionesPorVehiculo(vehiculoId);
    res.json(rs);
  }

  async getPorMecanico(req: Request, res: Response) {
    const mecanicoId = parseInt(req.params.mecanicoId);
    const rs = await this.reparacionService.getReparacionesPorMecanico(mecanicoId);
    res.json(rs);
  }

  async getPorRecepcionista(req: Request, res: Response) {
    const usuarioId = parseInt(req.params.usuarioId);
    const rs = await this.reparacionService.getReparacionesPorRecepcionista(usuarioId);
    res.json(rs);
  }
}
