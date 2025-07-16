import { Request, Response } from 'express';
import { UsuarioService } from '../../application/usuarioService';

export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  async getAll(req: Request, res: Response) {
    try {
      const usuarios = await this.usuarioService.getAllUsuarios();
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  }

  async getById(req: Request, res: Response) {
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

  async getByEmail(req: Request, res: Response) {
    try {
      const { email } = req.query;
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'Email es requerido' });
      }

      const usuario = await this.usuarioService.getUsuarioByEmail(email);
      if (usuario) {
        res.status(200).json(usuario);
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar usuario por email' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const usuario = await this.usuarioService.createUsuario(req.body);
      res.status(201).json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear usuario' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const usuario = await this.usuarioService.updateUsuario(id, req.body);
      
      if (usuario) {
        res.status(200).json(usuario);
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar usuario' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await this.usuarioService.deleteUsuario(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  }

  async activate(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const usuario = await this.usuarioService.activarUsuario(id);
      
      if (usuario) {
        res.status(200).json(usuario);
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al activar usuario' });
    }
  }

  async deactivate(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const usuario = await this.usuarioService.desactivarUsuario(id);
      
      if (usuario) {
        res.status(200).json(usuario);
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al desactivar usuario' });
    }
  }

  async getByRole(req: Request, res: Response) {
    try {
      const rolId = parseInt(req.params.rolId);
      const usuarios = await this.usuarioService.getUsuariosPorRol(rolId);
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuarios por rol' });
    }
  }

  async getReparacionesAsRecepcionista(req: Request, res: Response) {
    try {
      const usuarioId = parseInt(req.params.usuarioId);
      const reparaciones = await this.usuarioService.verReparacionesAsignadasComoRecepcionista(usuarioId);
      res.status(200).json(reparaciones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener reparaciones' });
    }
  }

  async authenticate(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const usuario = await this.usuarioService.autenticar(email, password);
      
      if (usuario) {
        res.status(200).json(usuario);
      } else {
        res.status(401).json({ error: 'Credenciales inválidas' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error en autenticación' });
    }
  }
}