import { Request, Response } from 'express';
import { VehiculoService } from '../../application/vehiculoService';
import { Vehiculo, CreateVehiculo, UpdateVehiculo } from '../../domain/entities/vehiculo';

export class VehiculoController {
  constructor(private readonly vehiculoService: VehiculoService) {}

  async getAll(req: Request, res: Response) {
    try {
      const vehiculos = await this.vehiculoService.getAllVehiculos();
      res.status(200).json(vehiculos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los vehículos' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const vehiculo = await this.vehiculoService.getVehiculoById(id);
      
      if (vehiculo) {
        res.status(200).json(vehiculo);
      } else {
        res.status(404).json({ error: 'Vehículo no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el vehículo' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const vehiculoData: CreateVehiculo = req.body;
      const nuevoVehiculo = await this.vehiculoService.createVehiculo(vehiculoData);
      res.status(201).json(nuevoVehiculo);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el vehículo' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const vehiculoData: UpdateVehiculo = req.body;
      const vehiculoActualizado = await this.vehiculoService.updateVehiculo(id, vehiculoData);
      
      if (vehiculoActualizado) {
        res.status(200).json(vehiculoActualizado);
      } else {
        res.status(404).json({ error: 'Vehículo no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el vehículo' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await this.vehiculoService.deleteVehiculo(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el vehículo' });
    }
  }

  async getByCliente(req: Request, res: Response) {
    try {
      const clienteId = parseInt(req.params.clienteId);
      const vehiculos = await this.vehiculoService.getVehiculosPorCliente(clienteId);
      res.status(200).json(vehiculos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los vehículos del cliente' });
    }
  }

  async getReparaciones(req: Request, res: Response) {
    try {
      const vehiculoId = parseInt(req.params.vehiculoId);
      const reparaciones = await this.vehiculoService.getReparacionesPorVehiculo(vehiculoId);
      res.status(200).json(reparaciones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las reparaciones del vehículo' });
    }
  }
}