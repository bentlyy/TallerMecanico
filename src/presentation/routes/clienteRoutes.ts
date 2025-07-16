//clienteRoute.ts
import { Router } from 'express';
import { ClienteController } from '../controllers/clienteController';
import { ClienteService } from '../../application/clienteService';
import { PrismaClienteRepository } from '../../infrastructure/db/prismaClienteRepository';
import { prisma } from '../../infrastructure/db/prisma';

const clienteRepository = new PrismaClienteRepository(prisma);
const clienteService = new ClienteService(clienteRepository);
const clienteController = new ClienteController(clienteService);

const clienteRouter = Router();

clienteRouter.get('/', clienteController.getAll.bind(clienteController));
clienteRouter.get('/:id', clienteController.getById.bind(clienteController));
clienteRouter.get('/email', clienteController.getByEmail.bind(clienteController));
clienteRouter.post('/', clienteController.create.bind(clienteController));
clienteRouter.put('/:id', clienteController.update.bind(clienteController));
clienteRouter.delete('/:id', clienteController.delete.bind(clienteController));

export default clienteRouter;