import { Response } from 'express';
import { AuthRequest } from '../../infrastructure/http/authMiddleware';
import { ReparacionService } from '../../application/reparacionService';
import { asyncHandler } from '../../infrastructure/http/asyncHandler';
import { NotFoundError } from '../../infrastructure/http/errors';
import { EstadoReparacion } from '../../domain/entities/reparacion';

export class ReparacionController {
  constructor(private readonly reparacionService: ReparacionService) {}

  getAll = asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await this.reparacionService.getAllReparaciones(page, limit);
    res.json(result);
  });

  getById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const data = await this.reparacionService.getReparacionById(id);
    if (!data) throw new NotFoundError('Reparación');
    res.json(data);
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const nueva = await this.reparacionService.createReparacion(req.body);
    res.status(201).json(nueva);
  });

  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const updated = await this.reparacionService.updateReparacion(id, req.body);
    if (!updated) throw new NotFoundError('Reparación');
    res.json(updated);
  });

  patch = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const {
      estado,
      mecanicoId,
      ubicacionId,
      fechaEntrada,
      fechaSalida,
      observaciones,
      descripcion,
      diagnostico,
      trabajosRealizados,
      problemaReportado,
      costoManoObra,
    } = req.body;

    const updated = await this.reparacionService.patchReparacion(id, {
      estado,
      mecanicoId: mecanicoId === null ? null : mecanicoId,
      ubicacionId: ubicacionId === undefined ? undefined : ubicacionId === null ? null : Number(ubicacionId),
      fechaEntrada: fechaEntrada ? new Date(fechaEntrada) : undefined,
      fechaSalida: fechaSalida ? new Date(fechaSalida) : undefined,
      observaciones,
      descripcion,
      diagnostico,
      trabajosRealizados,
      problemaReportado,
      costoManoObra: costoManoObra !== undefined ? Number(costoManoObra) : undefined,
    });
    if (!updated) throw new NotFoundError('Reparación');
    res.json(updated);
  });

  delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    await this.reparacionService.deleteReparacion(id);
    res.sendStatus(204);
  });

  cambiarEstado = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const { estado } = req.body;
    const result = await this.reparacionService.cambiarEstadoReparacion(id, estado as EstadoReparacion);
    if (!result) throw new NotFoundError('Reparación');
    res.json(result);
  });

  asignarMecanico = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const { mecanicoId } = req.body;
    const result = await this.reparacionService.asignarMecanico(id, mecanicoId);
    if (!result) throw new NotFoundError('Reparación');
    res.json(result);
  });

  registrarSalida = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const { fechaSalida } = req.body;
    const result = await this.reparacionService.registrarSalida(id, new Date(fechaSalida));
    if (!result) throw new NotFoundError('Reparación');
    res.json(result);
  });

  getPorVehiculo = asyncHandler(async (req: AuthRequest, res: Response) => {
    const vehId = parseInt(req.params.vehiculoId);
    const rs = await this.reparacionService.getReparacionesPorVehiculo(vehId);
    res.json(rs);
  });

  getPorMecanico = asyncHandler(async (req: AuthRequest, res: Response) => {
    const mecId = parseInt(req.params.mecanicoId);
    const rs = await this.reparacionService.getReparacionesPorMecanico(mecId);
    res.json(rs);
  });

  getPorRecepcionista = asyncHandler(async (req: AuthRequest, res: Response) => {
    const usrId = parseInt(req.params.usuarioId);
    const rs = await this.reparacionService.getReparacionesPorRecepcionista(usrId);
    res.json(rs);
  });

  getServicios = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const servicios = await this.reparacionService.getServicios(id);
    res.json(servicios);
  });

  addServicio = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const { servicioId, cantidad } = req.body;
    const servicios = await this.reparacionService.addServicio(id, servicioId, cantidad ?? 1);
    res.status(201).json(servicios);
  });

  setServicioCantidad = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const servicioId = parseInt(req.params.servicioId);
    const { cantidad } = req.body;
    const servicios = await this.reparacionService.setServicioCantidad(id, servicioId, cantidad);
    res.json(servicios);
  });

  removeServicio = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const servicioId = parseInt(req.params.servicioId);
    const servicios = await this.reparacionService.removeServicio(id, servicioId);
    res.json(servicios);
  });
}
