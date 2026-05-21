import { Response } from 'express';
import { AuthRequest } from '../../infrastructure/http/authMiddleware';
import { VehiculoService } from '../../application/vehiculoService';
import { asyncHandler } from '../../infrastructure/http/asyncHandler';
import { NotFoundError } from '../../infrastructure/http/errors';

export class VehiculoController {
  constructor(private readonly vehiculoService: VehiculoService) {}

  getAll = asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await this.vehiculoService.getAllVehiculos(page, limit);
    res.json(result);
  });

  getById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const vehiculo = await this.vehiculoService.getVehiculoById(id);
    if (!vehiculo) throw new NotFoundError('Vehículo');
    res.json(vehiculo);
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const nuevoVehiculo = await this.vehiculoService.createVehiculo(req.body);
    res.status(201).json(nuevoVehiculo);
  });

  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const vehiculoActualizado = await this.vehiculoService.updateVehiculo(id, req.body);
    if (!vehiculoActualizado) throw new NotFoundError('Vehículo');
    res.json(vehiculoActualizado);
  });

  delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    await this.vehiculoService.deleteVehiculo(id);
    res.sendStatus(204);
  });

  getByCliente = asyncHandler(async (req: AuthRequest, res: Response) => {
    const clienteId = parseInt(req.params.clienteId);
    const vehiculos = await this.vehiculoService.getVehiculosPorCliente(clienteId);
    res.json(vehiculos);
  });

  getReparaciones = asyncHandler(async (req: AuthRequest, res: Response) => {
    const vehiculoId = parseInt(req.params.vehiculoId);
    const reparaciones = await this.vehiculoService.getReparacionesPorVehiculo(vehiculoId);
    res.json(reparaciones);
  });
}
