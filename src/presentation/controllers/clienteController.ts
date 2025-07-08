import { Request, Response } from 'express';
import { ClienteService } from '../../application/clienteService';
import { CreateClienteDto } from '../../domain/entities/cliente';

export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  async create(req: Request, res: Response) {
    try {
      const cliente = await this.clienteService.crearCliente(req.body);
      res.status(201).json(cliente);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear cliente' });
    }
  }
}