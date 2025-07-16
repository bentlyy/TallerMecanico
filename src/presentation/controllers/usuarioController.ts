import { Request, Response } from "express";
import { UsuarioService } from "../../application/usuarioService";

export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}

  getAll = async (_req: Request, res: Response) => {
    const usuarios = await this.usuarioService.listarUsuarios();
    res.json(usuarios);
  };

  getById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const usuario = await this.usuarioService.obtenerUsuario(id);
    usuario ? res.json(usuario) : res.status(404).json({ error: "Usuario no encontrado" });
  };

  create = async (req: Request, res: Response) => {
    const nuevoUsuario = await this.usuarioService.crearUsuario(req.body);
    res.status(201).json(nuevoUsuario);
  };

  update = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const actualizado = await this.usuarioService.actualizarUsuario(id, req.body);
    actualizado ? res.json(actualizado) : res.status(404).json({ error: "Usuario no encontrado" });
  };

  delete = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    await this.usuarioService.eliminarUsuario(id);
    res.status(204).send();
  };
}
