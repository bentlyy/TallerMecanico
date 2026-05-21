import { Response } from 'express';
import { AuthRequest } from '../../infrastructure/http/authMiddleware';
import { ClienteService } from '../../application/clienteService';
import { asyncHandler } from '../../infrastructure/http/asyncHandler';
import { NotFoundError } from '../../infrastructure/http/errors';

export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  getAll = asyncHandler(async (req: AuthRequest, res: Response) => {
    const empresaId = req.usuario!.empresaId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await this.clienteService.getAllClientes(empresaId, page, limit);
    res.json(result);
  });

  getById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const cliente = await this.clienteService.getClienteById(id);
    if (!cliente) throw new NotFoundError('Cliente');
    res.json(cliente);
  });

  getByEmail = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email } = req.query;
    if (!email || typeof email !== 'string') {
      res.status(400).json({ error: 'Email es requerido' });
      return;
    }
    const empresaId = req.usuario!.empresaId;
    const cliente = await this.clienteService.getClienteByEmail(email, empresaId);
    if (!cliente) throw new NotFoundError('Cliente');
    res.json(cliente);
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const empresaId = req.usuario!.empresaId;
    const nuevoCliente = await this.clienteService.createCliente({ ...req.body, empresaId });
    res.status(201).json(nuevoCliente);
  });

  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const clienteActualizado = await this.clienteService.updateCliente(id, req.body);
    if (!clienteActualizado) throw new NotFoundError('Cliente');
    res.json(clienteActualizado);
  });

  delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    await this.clienteService.deleteCliente(id);
    res.sendStatus(204);
  });
}
