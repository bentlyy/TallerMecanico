import { Router } from 'express';
import { PiezaController } from '../controllers/piezaController';
import { PiezaService } from '../../application/piezaService';
import { PrismaPiezaRepository } from '../../infrastructure/db/prismaPiezaRepository';
import { prisma } from '../../infrastructure/db/prisma';

const piezaRouter = Router();

const repository = new PrismaPiezaRepository(prisma);
const service = new PiezaService(repository);
const controller = new PiezaController(service);

piezaRouter.get('/', controller.getAll.bind(controller));
piezaRouter.get('/:id', controller.getById.bind(controller));
piezaRouter.get('/codigo/buscar', controller.getByCodigo.bind(controller));
piezaRouter.post('/', controller.create.bind(controller));
piezaRouter.put('/:id', controller.update.bind(controller));
piezaRouter.delete('/:id', controller.delete.bind(controller));
piezaRouter.patch('/:id/stock', controller.updateStock.bind(controller));
piezaRouter.patch('/:id/stock/descontar', controller.decreaseStock.bind(controller));

export default piezaRouter;