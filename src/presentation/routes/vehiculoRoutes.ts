import { Router } from 'express';
import { VehiculoController } from '../controllers/vehiculoController';
import { VehiculoService } from '../../application/vehiculoService';
import { PrismaVehiculoRepository } from '../../infrastructure/db/prismaVehiculoRepository';
import { PrismaClienteRepository } from '../../infrastructure/db/prismaClienteRepository'; // 👈 Asegúrate de tener este archivo
import { prisma } from '../../infrastructure/db/prisma';

const vehiculoRepository = new PrismaVehiculoRepository(prisma);
const clienteRepository = new PrismaClienteRepository(prisma); // 👈 nuevo repositorio

const service = new VehiculoService(vehiculoRepository, clienteRepository);
const controller = new VehiculoController(service);

const vehiculoRouter = Router();

vehiculoRouter.get('/', controller.getAll.bind(controller));
vehiculoRouter.get('/:id', controller.getById.bind(controller));
vehiculoRouter.post('/', controller.create.bind(controller));
vehiculoRouter.put('/:id', controller.update.bind(controller));
vehiculoRouter.delete('/:id', controller.delete.bind(controller));
vehiculoRouter.get('/cliente/:clienteId', controller.getByCliente.bind(controller));
vehiculoRouter.get('/:vehiculoId/reparaciones', controller.getReparaciones.bind(controller));

export default vehiculoRouter;
