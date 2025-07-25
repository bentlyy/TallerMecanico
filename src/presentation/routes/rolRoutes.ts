import { Router } from 'express';
import { RolController } from '../controllers/rolController';
import { RolService } from '../../application/rolService';
import { PrismaRolRepository } from '../../infrastructure/db/prismaRolRepository';
import { prisma } from '../../infrastructure/db/prisma';

const rolRepository = new PrismaRolRepository(prisma);
const rolService = new RolService(rolRepository);
const rolController = new RolController(rolService);

const rolRouter = Router();

rolRouter.get('/', rolController.getAll.bind(rolController));
rolRouter.get('/:id', rolController.getById.bind(rolController));
rolRouter.post('/', rolController.create.bind(rolController));
rolRouter.put('/:id', rolController.update.bind(rolController));
rolRouter.delete('/:id', rolController.delete.bind(rolController));

export default rolRouter;