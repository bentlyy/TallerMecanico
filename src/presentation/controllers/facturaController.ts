import { Request, Response } from 'express';
import { FacturaService } from '../../application/facturaService';

export class FacturaController {
  constructor(private readonly facturaService: FacturaService) {}

  async getAll(req: Request, res: Response) {
    try {
      const facturas = await this.facturaService.getAllFacturas();
      res.status(200).json(facturas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las facturas' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const factura = await this.facturaService.getFacturaById(id);

      if (factura) {
        res.status(200).json(factura);
      } else {
        res.status(404).json({ error: 'Factura no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la factura' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { clienteId, reparacionId } = req.body;

      if (!clienteId || !reparacionId) {
        return res.status(400).json({ error: 'clienteId y reparacionId son requeridos' });
      }

      const factura = await this.facturaService.createFactura({
        clienteId,
        reparacionId
        // fecha es opcional y se asigna automáticamente en el repository
      });

      res.status(201).json(factura);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al crear la factura' });
    }
  }

  async getByCliente(req: Request, res: Response) {
    try {
      const clienteId = parseInt(req.params.clienteId);
      const facturas = await this.facturaService.getFacturasPorCliente(clienteId);
      res.status(200).json(facturas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener facturas por cliente' });
    }
  }

  async getByReparacion(req: Request, res: Response) {
    try {
      const reparacionId = parseInt(req.params.reparacionId);
      const factura = await this.facturaService.getFacturasPorReparacion(reparacionId);

      if (factura) {
        res.status(200).json(factura);
      } else {
        res.status(404).json({ error: 'Factura no encontrada para esta reparación' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener factura por reparación' });
    }
  }
}
