import { Router } from 'express';
import { RolController } from '../controllers/rolController';
import { RolService } from '../../application/rolService';
import { PrismaRolRepository } from '../../infrastructure/db/prismaRolRepository';
import { prisma } from '../../infrastructure/db/prisma';

const rolRouter = Router();

const repository = new PrismaRolRepository(prisma);
const service = new RolService(repository);
const controller = new RolController(service);

// Rutas CRUD básicas
rolRouter.get('/', controller.getAll.bind(controller));
rolRouter.get('/:id', controller.getById.bind(controller));
rolRouter.post('/', controller.create.bind(controller));
rolRouter.put('/:id', controller.update.bind(controller));
rolRouter.delete('/:id', controller.delete.bind(controller));

// Ruta específica para permisos
rolRouter.get('/:rolId/permisos', controller.getPermisos.bind(controller));

export default rolRouter;