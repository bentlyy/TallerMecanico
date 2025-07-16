import { Router } from 'express';
import { MecanicoController } from '../controllers/mecanicoController';
import { MecanicoService } from '../../application/mecanicoService';
import { PrismaMecanicoRepository } from '../../infrastructure/db/prismaMecanicoRepository';
import { prisma } from '../../infrastructure/db/prisma';

const mecanicoRouter = Router();

const repository = new PrismaMecanicoRepository(prisma);
const service = new MecanicoService(repository);
const controller = new MecanicoController(service);

mecanicoRouter.get('/', controller.getAll.bind(controller));
mecanicoRouter.get('/:id', controller.getById.bind(controller));
mecanicoRouter.post('/', controller.create.bind(controller));
mecanicoRouter.put('/:id', controller.update.bind(controller));
mecanicoRouter.get('/:mecanicoId/reparaciones', controller.getReparaciones.bind(controller));

export default mecanicoRouter;