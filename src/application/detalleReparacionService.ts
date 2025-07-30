import { DetalleReparacionRepository } from '../domain/repositories/detalleReparacionRepository';
import { DetalleReparacion, CreateDetalleReparacion, UpdateDetalleReparacion } from '../domain/entities/detalleReparacion';
import { ReparacionService } from './reparacionService';
import { PiezaService } from './piezaService';

export class DetalleReparacionService {
  constructor(
    private readonly repository: DetalleReparacionRepository,
    private readonly reparacionService: ReparacionService,
    private readonly piezaService: PiezaService
  ) {}

  async getAllDetalles(): Promise<DetalleReparacion[]> {
    return this.repository.getAll();
  }

  async getDetalleById(id: number): Promise<DetalleReparacion | null> {
    return this.repository.getById(id);
  }

  async createDetalle(data: CreateDetalleReparacion): Promise<DetalleReparacion> {
    // Validar que la reparación existe
    const reparacion = await this.reparacionService.getReparacionById(data.reparacionId);
    if (!reparacion) {
      throw new Error('Reparación no encontrada');
    }

    // Validar que la pieza existe y tiene stock suficiente
    const pieza = await this.piezaService.getPiezaById(data.piezaId);
    if (!pieza) {
      throw new Error('Pieza no encontrada');
    }
    if (pieza.stock < data.cantidad) {
      throw new Error('Stock insuficiente');
    }

    // Crear el detalle
    const detalle = await this.repository.create({
      ...data,
      precioUnitario: pieza.precio // Usar el precio actual de la pieza
    });

    // Actualizar el stock de la pieza
    await this.piezaService.updateStock(pieza.id, pieza.stock - data.cantidad);

    return detalle;
  }

  async updateDetalle(id: number, data: UpdateDetalleReparacion): Promise<DetalleReparacion | null> {
    // Obtener detalle actual para validaciones
    const detalleActual = await this.getDetalleById(id);
    if (!detalleActual) {
      throw new Error('Detalle no encontrado');
    }

    // Si se actualiza la cantidad, validar stock
    if (data.cantidad !== undefined) {
      const pieza = await this.piezaService.getPiezaById(detalleActual.piezaId);
      if (!pieza) {
        throw new Error('Pieza no encontrada');
      }

      const diferencia = data.cantidad - detalleActual.cantidad;
      if (pieza.stock < diferencia) {
        throw new Error('Stock insuficiente para esta actualización');
      }

      // Actualizar stock
      await this.piezaService.updateStock(pieza.id, pieza.stock - diferencia);
    }

    return this.repository.update(id, data);
  }

  async deleteDetalle(id: number): Promise<void> {
    // Obtener detalle para restaurar stock
    const detalle = await this.getDetalleById(id);
    if (!detalle) {
      throw new Error('Detalle no encontrado');
    }

    const pieza = await this.piezaService.getPiezaById(detalle.piezaId);
    if (!pieza) {
      throw new Error('Pieza no encontrada');
    }

    // Restaurar stock antes de eliminar
    await this.piezaService.updateStock(pieza.id, pieza.stock + detalle.cantidad);

    // Eliminar detalle
    await this.repository.delete(id);
  }

  async getDetallesPorReparacion(reparacionId: number): Promise<DetalleReparacion[]> {
    // Validar que la reparación existe
    const reparacion = await this.reparacionService.getReparacionById(reparacionId);
    if (!reparacion) {
      throw new Error('Reparación no encontrada');
    }

    return this.repository.getByReparacion(reparacionId);
  }

  async getDetallesPorPieza(piezaId: number): Promise<DetalleReparacion[]> {
    // Validar que la pieza existe
    const pieza = await this.piezaService.getPiezaById(piezaId);
    if (!pieza) {
      throw new Error('Pieza no encontrada');
    }

    return this.repository.getByPieza(piezaId);
  }

  async updateCantidadDetalle(id: number, cantidad: number): Promise<DetalleReparacion | null> {
    if (cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a cero');
    }

    const detalle = await this.getDetalleById(id);
    if (!detalle) {
      throw new Error('Detalle no encontrado');
    }

    const pieza = await this.piezaService.getPiezaById(detalle.piezaId);
    if (!pieza) {
      throw new Error('Pieza no encontrada');
    }

    const diferencia = cantidad - detalle.cantidad;
    if (pieza.stock < diferencia) {
      throw new Error('Stock insuficiente para esta actualización');
    }

    // Actualizar stock
    await this.piezaService.updateStock(pieza.id, pieza.stock - diferencia);

    return this.repository.updateCantidad(id, cantidad);
  }
}