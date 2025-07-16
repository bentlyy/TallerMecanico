//clienteController.ts
import { Request, Response } from 'express';
import { ClienteService } from '../../application/clienteService';
import { Cliente, CreateCliente, UpdateCliente } from '../../domain/entities/cliente';

export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const clientes = await this.clienteService.getAllClientes();
      res.status(200).json(clientes);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los clientes' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const cliente = await this.clienteService.getClienteById(id);
      if (cliente) {
        res.status(200).json(cliente);
      } else {
        res.status(404).json({ error: 'Cliente no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el cliente' });
    }
  }

  async getByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.query;
      if (!email || typeof email !== 'string') {
        res.status(400).json({ error: 'Email es requerido' });
        return;
      }
      const cliente = await this.clienteService.getClienteByEmail(email);
      if (cliente) {
        res.status(200).json(cliente);
      } else {
        res.status(404).json({ error: 'Cliente no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el cliente por email' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
  try {
    const { nombre, email, telefono, direccion } = req.body;

    // Validar campos requeridos
    if (!nombre || typeof nombre !== 'string') {
      res.status(400).json({ error: 'El nombre es obligatorio y debe ser un string.' });
      return;
    }

    // Email puede ser opcional, pero si se requiere:
    if (!email || typeof email !== 'string') {
      res.status(400).json({ error: 'El email es obligatorio y debe ser un string.' });
      return;
    }

    const clienteData: CreateCliente = { nombre, email, telefono, direccion };
    const nuevoCliente = await this.clienteService.createCliente(clienteData);
    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el cliente' });
  }
}

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const clienteData: UpdateCliente = req.body;
      const clienteActualizado = await this.clienteService.updateCliente(id, clienteData);
      if (clienteActualizado) {
        res.status(200).json(clienteActualizado);
      } else {
        res.status(404).json({ error: 'Cliente no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el cliente' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.clienteService.deleteCliente(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el cliente' });
    }
  }
}