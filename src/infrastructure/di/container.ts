import { PrismaClienteRepository } from '../db/prismaClienteRepository';
import { PrismaVehiculoRepository } from "../db/prismaVehiculoRepository";
import { ClienteRepository } from '../../domain/repositories/clienteRepository';
import { VehiculoService } from "../../application/vehiculoService";

const clienteRepository: ClienteRepository = new PrismaClienteRepository();

export { clienteRepository };
export const vehiculoRepository = new PrismaVehiculoRepository();
export const vehiculoService = new VehiculoService(vehiculoRepository);