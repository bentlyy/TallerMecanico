import { Response } from 'express';
import { AuthRequest } from '../../infrastructure/http/authMiddleware';
import { UsuarioService } from '../../application/usuarioService';
import { asyncHandler } from '../../infrastructure/http/asyncHandler';
import { NotFoundError } from '../../infrastructure/http/errors';

export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  getAll = asyncHandler(async (req: AuthRequest, res: Response) => {
    const empresaId = req.usuario!.empresaId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await this.usuarioService.getAllUsuarios(empresaId, page, limit);
    res.json(result);
  });

  getById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const usuario = await this.usuarioService.getUsuarioById(id);
    if (!usuario) throw new NotFoundError('Usuario');
    res.json(usuario);
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const empresaId = req.usuario!.empresaId;
    const nuevoUsuario = await this.usuarioService.createUsuario({
      email: req.body.email,
      passwordHash: req.body.password,
      nombre: req.body.nombre,
      activo: true,
      rolId: req.body.rolId,
      empresaId,
    });
    res.status(201).json(nuevoUsuario);
  });

  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const usuarioActualizado = await this.usuarioService.updateUsuario(id, req.body);
    if (!usuarioActualizado) throw new NotFoundError('Usuario');
    res.json(usuarioActualizado);
  });

  delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    await this.usuarioService.deleteUsuario(id);
    res.sendStatus(204);
  });

  activate = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const usuario = await this.usuarioService.activateUsuario(id);
    if (!usuario) throw new NotFoundError('Usuario');
    res.json(usuario);
  });

  deactivate = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const usuario = await this.usuarioService.deactivateUsuario(id);
    if (!usuario) throw new NotFoundError('Usuario');
    res.json(usuario);
  });

  login = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email y password son requeridos' });
      return;
    }
    const { loginService } = await import('../../infrastructure/di/container');
    const result = await loginService(email, password);
    if (!result) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }
    res.json(result);
  });
}
