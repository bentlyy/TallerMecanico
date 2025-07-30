import { ReparacionRepository } from '../domain/repositories/reparacionRepository';
import { Reparacion, CreateReparacion, UpdateReparacion, EstadoReparacion } from '../domain/entities/reparacion';
import { DetalleReparacion } from '../domain/entities/detalleReparacion';
import { VehiculoService } from './vehiculoService';
import { MecanicoService } from './mecanicoService';
import { UsuarioService } from './usuarioService';
import { PiezaService } from './piezaService';

export class ReparacionService {
  constructor(
    private readonly repository: ReparacionRepository,
    private readonly vehiculoService: VehiculoService,
    private readonly mecanicoService: MecanicoService,
    private readonly usuarioService: UsuarioService,
    private readonly piezaService: PiezaService
  ) {}

  async getAllReparaciones(): Promise<Reparacion[]> {
    return this.repository.getAll();
  }

  async getReparacionById(id: number): Promise<Reparacion | null> {
    return this.repository.getById(id);
  }

  async createReparacion(data: CreateReparacion): Promise<Reparacion> {
    // Validar que el vehículo existe
    const vehiculo = await this.vehiculoService.getVehiculoById(data.vehiculoId);
    if (!vehiculo) throw new Error('Vehículo no encontrado');

    // Validar que el recepcionista (usuario) existe
    const recepcionista = await this.usuarioService.getUsuarioById(data.recepcionistaId);
    if (!recepcionista) throw new Error('Recepcionista no encontrado');

    // Validar mecánico si está presente
    if (data.mecanicoId) {
      const mecanico = await this.mecanicoService.getMecanicoById(data.mecanicoId);
      if (!mecanico) throw new Error('Mecánico no encontrado');
    }

    return this.repository.create(data);
  }

  async updateReparacion(id: number, data: UpdateReparacion): Promise<Reparacion | null> {
    // Validaciones similares a create, pero solo si los IDs están en data
    if (data.vehiculoId) {
      const vehiculo = await this.vehiculoService.getVehiculoById(data.vehiculoId);
      if (!vehiculo) throw new Error('Vehículo no encontrado');
    }

    if (data.recepcionistaId) {
      const recepcionista = await this.usuarioService.getUsuarioById(data.recepcionistaId);
      if (!recepcionista) throw new Error('Recepcionista no encontrado');
    }

    if (data.mecanicoId) {
      const mecanico = await this.mecanicoService.getMecanicoById(data.mecanicoId);
      if (!mecanico) throw new Error('Mecánico no encontrado');
    }

    return this.repository.update(id, data);
  }

  async deleteReparacion(id: number): Promise<void> {
    return this.repository.delete(id);
  }

  async cambiarEstadoReparacion(id: number, estado: EstadoReparacion): Promise<Reparacion | null> {
    return this.repository.updateEstado(id, estado);
  }

  async asignarMecanico(id: number, mecanicoId: number | null): Promise<Reparacion | null> {
    if (mecanicoId) {
      const mecanico = await this.mecanicoService.getMecanicoById(mecanicoId);
      if (!mecanico) throw new Error('Mecánico no encontrado');
    }
    return this.repository.asignarMecanico(id, mecanicoId);
  }

  async registrarSalida(id: number, fechaSalida: Date = new Date()): Promise<Reparacion | null> {
    // Obtener reparación para verificar estado
    const reparacion = await this.getReparacionById(id);
    if (!reparacion) throw new Error('Reparación no encontrada');
    
    if (reparacion.estado !== EstadoReparacion.TERMINADO) {
      throw new Error('Solo se puede registrar salida de reparaciones terminadas');
    }

    return this.repository.registrarSalida(id, fechaSalida);
  }

  async getDetallesReparacion(reparacionId: number): Promise<DetalleReparacion[]> {
    return this.repository.getDetallesReparacion(reparacionId);
  }

  async getReparacionesPorVehiculo(vehiculoId: number): Promise<Reparacion[]> {
    // Validar que el vehículo existe
    const vehiculo = await this.vehiculoService.getVehiculoById(vehiculoId);
    if (!vehiculo) throw new Error('Vehículo no encontrado');
    return this.repository.getByVehiculo(vehiculoId);
  }

  async getReparacionesPorMecanico(mecanicoId: number): Promise<Reparacion[]> {
    // Validar que el mecánico existe
    const mecanico = await this.mecanicoService.getMecanicoById(mecanicoId);
    if (!mecanico) throw new Error('Mecánico no encontrado');
    return this.repository.getByMecanico(mecanicoId);
  }

  async getReparacionesPorRecepcionista(usuarioId: number): Promise<Reparacion[]> {
    // Validar que el usuario (recepcionista) existe
    const usuario = await this.usuarioService.getUsuarioById(usuarioId);
    if (!usuario) throw new Error('Recepcionista no encontrado');
    return this.repository.getByRecepcionista(usuarioId);
  }

  async addDetalleReparacion(reparacionId: number, piezaId: number, cantidad: number): Promise<DetalleReparacion> {
    // Validar que la reparación existe
    const reparacion = await this.getReparacionById(reparacionId);
    if (!reparacion) throw new Error('Reparación no encontrada');

    // Validar que la pieza existe y tiene stock suficiente
    const pieza = await this.piezaService.getPiezaById(piezaId);
    if (!pieza) throw new Error('Pieza no encontrada');
    if (pieza.stock < cantidad) throw new Error('Stock insuficiente');

    // Crear detalle y actualizar stock
    const detalle = await this.repository.addDetalleReparacion(reparacionId, piezaId, cantidad, pieza.precio);
    await this.piezaService.updateStock(piezaId, pieza.stock - cantidad);

    return detalle;
  }

  async removeDetalleReparacion(reparacionId: number, piezaId: number): Promise<void> {
    // Obtener detalle para restaurar stock
    const detalles = await this.getDetallesReparacion(reparacionId);
    const detalle = detalles.find(d => d.piezaId === piezaId);
    if (!detalle) throw new Error('Detalle no encontrado');

    const pieza = await this.piezaService.getPiezaById(piezaId);
    if (!pieza) throw new Error('Pieza no encontrada');

    // Restaurar stock
    await this.piezaService.updateStock(piezaId, pieza.stock + detalle.cantidad);

    // Eliminar detalle
    await this.repository.removeDetalleReparacion(reparacionId, piezaId);
  }
}