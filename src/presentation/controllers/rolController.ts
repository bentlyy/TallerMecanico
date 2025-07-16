import { Request, Response } from 'express';
import { RolService } from '../../application/rolService';

export class RolController {
  constructor(private readonly rolService: RolService) {}

  async getAll(req: Request, res: Response) {
    try {
      const roles = await this.rolService.getAllRoles();
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los roles' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const rol = await this.rolService.getRolById(id);
      
      if (rol) {
        res.status(200).json(rol);
      } else {
        res.status(404).json({ error: 'Rol no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el rol' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const rol = await this.rolService.createRol(req.body);
      res.status(201).json(rol);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el rol' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const rol = await this.rolService.updateRol(id, req.body);
      
      if (rol) {
        res.status(200).json(rol);
      } else {
        res.status(404).json({ error: 'Rol no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el rol' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await this.rolService.deleteRol(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el rol' });
    }
  }

  async getPermisos(req: Request, res: Response) {
    try {
      const rolId = parseInt(req.params.rolId);
      const permisos = await this.rolService.getPermisosDeRol(rolId);
      
      if (permisos) {
        res.status(200).json(permisos);
      } else {
        res.status(404).json({ error: 'Rol no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los permisos' });
    }
  }
}