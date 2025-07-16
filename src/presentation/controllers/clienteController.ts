import { Request, Response } from "express";
import { ClienteService } from "../../application/clienteService";

export class ClienteController {
  constructor(private clienteService: ClienteService) {}

  getAll = async (_req: Request, res: Response) => {
    const clientes = await this.clienteService.listarClientes();
    res.json(clientes);
  };

  getById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const cliente = await this.clienteService.obtenerCliente(id);
    cliente ? res.json(cliente) : res.status(404).json({ error: "Cliente no encontrado" });
  };

  create = async (req: Request, res: Response) => {
    const nuevoCliente = await this.clienteService.crearCliente(req.body);
    res.status(201).json(nuevoCliente);
  };

  update = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const clienteActualizado = await this.clienteService.actualizarCliente(id, req.body);
    clienteActualizado ? res.json(clienteActualizado) : res.status(404).json({ error: "Cliente no encontrado" });
  };

  delete = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    await this.clienteService.eliminarCliente(id);
    res.status(204).send();
  };
}
