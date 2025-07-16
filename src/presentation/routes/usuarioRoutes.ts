import { Router } from 'express';
import { UsuarioController } from '../controllers/usuarioController';
import { UsuarioService } from '../../application/usuarioService';
import { PrismaUsuarioRepository } from '../../infrastructure/db/prismaUsuarioRepository';
import { prisma } from '../../infrastructure/db/prisma';

const usuarioRouter = Router();

const repository = new PrismaUsuarioRepository(prisma);
const service = new UsuarioService(repository);
const controller = new UsuarioController(service);

// Rutas básicas CRUD
usuarioRouter.get('/', controller.getAll.bind(controller));
usuarioRouter.get('/:id', controller.getById.bind(controller));
usuarioRouter.get('/email', controller.getByEmail.bind(controller));
usuarioRouter.post('/', controller.create.bind(controller));
usuarioRouter.put('/:id', controller.update.bind(controller));
usuarioRouter.delete('/:id', controller.delete.bind(controller));

// Rutas específicas
usuarioRouter.post('/:id/activate', controller.activate.bind(controller));
usuarioRouter.post('/:id/deactivate', controller.deactivate.bind(controller));
usuarioRouter.get('/rol/:rolId', controller.getByRole.bind(controller));
usuarioRouter.get('/:usuarioId/reparaciones', controller.getReparacionesAsRecepcionista.bind(controller));
usuarioRouter.post('/auth', controller.authenticate.bind(controller));

export default usuarioRouter;