import { PrismaClienteRepository } from '../db/prismaClienteRepository';
import { ClienteRepository } from '../../domain/repositories/clienteRepository';
import { PrismaVehiculoRepository } from "../db/prismaVehiculoRepository";
import { VehiculoService } from "../../application/vehiculoService";

const clienteRepository: ClienteRepository = new PrismaClienteRepository();

export { clienteRepository };
export const vehiculoRepository = new PrismaVehiculoRepository();
export const vehiculoService = new VehiculoService(vehiculoRepository);