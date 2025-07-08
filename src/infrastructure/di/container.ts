import { PrismaClienteRepository } from '../db/prismaClienteRepository';
import { ClienteRepository } from '../../domain/repositories/clienteRepository';

const clienteRepository: ClienteRepository = new PrismaClienteRepository();

export { clienteRepository };