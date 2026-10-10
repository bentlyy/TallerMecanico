import { FacturaRepository } from '../domain/repositories/facturaRepository';
import { PagoRepository } from '../domain/repositories/pagoRepository';
import { ReparacionRepository } from '../domain/repositories/reparacionRepository';
import { CreateFactura, Factura } from '../domain/entities/factura';
import { CreatePago, Pago } from '../domain/entities/pago';
import { EstadoReparacion } from '../domain/entities/reparacion';
import { PaginatedResult } from '../domain/types/pagination';
import { ConflictError, NotFoundError } from '../infrastructure/http/errors';

export class FacturaService {
  constructor(
    private readonly repository: FacturaRepository,
    private readonly pagoRepository: PagoRepository,
    private readonly reparacionRepository: ReparacionRepository,
  ) {}

  async getAllFacturas(page = 1, limit = 20): Promise<PaginatedResult<Factura>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([this.repository.getAll(skip, limit), this.repository.count()]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getFacturaById(id: number): Promise<Factura | null> {
    return this.repository.getById(id);
  }

  async createFactura(data: CreateFactura): Promise<Factura> {
    const existente = await this.repository.getByReparacion(data.reparacionId);
    if (existente) {
      throw new ConflictError('La reparación ya tiene una factura asociada');
    }

    const factura = await this.repository.create(data);
    await this.sincronizarEstadoReparacion(factura);
    return (await this.repository.getById(factura.id)) ?? factura;
  }

  async deleteFactura(id: number): Promise<void> {
    const factura = await this.repository.getById(id);
    if (!factura) throw new NotFoundError('Factura');
    await this.repository.delete(id);

    const reparacion = await this.reparacionRepository.getById(factura.reparacionId);
    if (
      reparacion &&
      (reparacion.estado === EstadoReparacion.FACTURADO || reparacion.estado === EstadoReparacion.PAGADO)
    ) {
      await this.reparacionRepository.cambiarEstado(reparacion.id, EstadoReparacion.TERMINADO);
    }
  }

  async getFacturasPorCliente(clienteId: number): Promise<Factura[]> {
    return this.repository.getByCliente(clienteId);
  }

  async getFacturasPorReparacion(reparacionId: number): Promise<Factura | null> {
    return this.repository.getByReparacion(reparacionId);
  }

  async getPagos(facturaId: number): Promise<Pago[]> {
    const factura = await this.repository.getById(facturaId);
    if (!factura) throw new NotFoundError('Factura');
    return this.pagoRepository.getByFactura(facturaId);
  }

  async addPago(facturaId: number, data: Omit<CreatePago, 'facturaId'>): Promise<Factura> {
    const factura = await this.repository.getById(facturaId);
    if (!factura) throw new NotFoundError('Factura');

    await this.pagoRepository.create({ ...data, facturaId });
    await this.sincronizarEstadoReparacion(factura);
    return (await this.repository.getById(facturaId))!;
  }

  async deletePago(facturaId: number, pagoId: number): Promise<Factura> {
    const factura = await this.repository.getById(facturaId);
    if (!factura) throw new NotFoundError('Factura');

    const pago = await this.pagoRepository.getById(pagoId);
    if (!pago || pago.facturaId !== facturaId) throw new NotFoundError('Pago');

    await this.pagoRepository.delete(pagoId);
    await this.sincronizarEstadoReparacion(factura);
    return (await this.repository.getById(facturaId))!;
  }

  private calcularEstado(total: number, pagado: number): EstadoReparacion {
    if (total > 0 && pagado >= total - 0.001) return EstadoReparacion.PAGADO;
    return EstadoReparacion.FACTURADO;
  }

  private async sincronizarEstadoReparacion(factura: Factura): Promise<void> {
    const reparacion = await this.reparacionRepository.getById(factura.reparacionId);
    if (!reparacion) return;
    if (reparacion.estado === EstadoReparacion.ENTREGADO) return;

    const pagado = await this.pagoRepository.sumByFactura(factura.id);
    const nuevo = this.calcularEstado(factura.total, pagado);
    if (nuevo !== reparacion.estado) {
      await this.reparacionRepository.cambiarEstado(reparacion.id, nuevo);
    }
  }
}
