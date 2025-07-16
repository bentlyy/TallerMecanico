import { Request, Response } from "express";
import { FacturaService } from "../../application/facturaService";

export class FacturaController {
  constructor(private service: FacturaService) {}

  getAll = async (_req: Request, res: Response) => {
    const facturas = await this.service.listar();
    res.json(facturas);
  };

  getById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const factura = await this.service.obtenerPorId(id);
    factura ? res.json(factura) : res.status(404).json({ error: "No encontrada" });
  };

  generar = async (req: Request, res: Response) => {
    const { reparacionId } = req.body;
    try {
      const factura = await this.service.generarFactura(reparacionId);
      res.status(201).json(factura);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
