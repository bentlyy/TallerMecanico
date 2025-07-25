import { Request, Response } from 'express';
import { UsuarioService } from '../../application/usuarioService';
import { Usuario, CreateUsuario, UpdateUsuario } from '../../domain/entities/usuario';
import { usuarioService } from '@infrastructure/di/container';

export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const usuarios = await this.usuarioService.getAllUsuarios();
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const usuario = await this.usuarioService.getUsuarioById(id);
      
      if (usuario) {
        res.status(200).json(usuario);
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el usuario' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, nombre, rolId } = req.body;
      
      // Validaciones básicas
      if (!email || !password || !nombre || !rolId) {
        res.status(400).json({ error: 'Todos los campos son requeridos' });
        return;
      }

      // En la práctica, deberías hashear la contraseña aquí antes de crear el usuario
      const passwordHash = password; // Esto debería ser el hash de la contraseña

      const nuevoUsuario = await this.usuarioService.createUsuario({
        email,
        passwordHash,
        nombre,
        activo: true,
        rolId
      });
      
      res.status(201).json(nuevoUsuario);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const data: UpdateUsuario = req.body;
      
      const usuarioActualizado = await this.usuarioService.updateUsuario(id, data);
      
      if (usuarioActualizado) {
        res.status(200).json(usuarioActualizado);
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.usuarioService.deleteUsuario(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
  }

  async activate(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const usuario = await this.usuarioService.activateUsuario(id);
      
      if (usuario) {
        res.status(200).json(usuario);
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al activar el usuario' });
    }
  }

  async deactivate(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const usuario = await this.usuarioService.deactivateUsuario(id);
      
      if (usuario) {
        res.status(200).json(usuario);
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al desactivar el usuario' });
    }
  }
}


export const usuarioController = new UsuarioController(usuarioService);