import { Request, Response } from 'express';
import { RolService } from '../../application/rolService';
import { Rol, CreateRol, UpdateRol } from '../../domain/entities/rol';

export class RolController {
  constructor(private readonly rolService: RolService) {}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const roles = await this.rolService.getAllRoles();
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los roles' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
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

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, permisos } = req.body;
      
      if (!nombre || typeof nombre !== 'string') {
        res.status(400).json({ error: 'Nombre es requerido y debe ser un string' });
        return;
      }

      if (!permisos || typeof permisos !== 'object') {
        res.status(400).json({ error: 'Permisos es requerido y debe ser un objeto' });
        return;
      }

      const nuevoRol = await this.rolService.createRol({ nombre, permisos });
      res.status(201).json(nuevoRol);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const data: UpdateRol = req.body;
      
      const rolActualizado = await this.rolService.updateRol(id, data);
      
      if (rolActualizado) {
        res.status(200).json(rolActualizado);
      } else {
        res.status(404).json({ error: 'Rol no encontrado' });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.rolService.deleteRol(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el rol' });
    }
  }
}