import { Router } from 'express';
import { clienteController } from '../../infrastructure/di/container';
import { authMiddleware } from '../../infrastructure/http/authMiddleware';
import { validate, schemas } from '../../infrastructure/http/validationMiddleware';

const clienteRouter = Router();

clienteRouter.get('/', authMiddleware, clienteController.getAll.bind(clienteController));
clienteRouter.get('/:id', authMiddleware, clienteController.getById.bind(clienteController));
clienteRouter.get('/email', authMiddleware, clienteController.getByEmail.bind(clienteController));
clienteRouter.post(
  '/',
  authMiddleware,
  validate({ body: schemas.cliente.create }),
  clienteController.create.bind(clienteController),
);
clienteRouter.put(
  '/:id',
  authMiddleware,
  validate({ body: schemas.cliente.update }),
  clienteController.update.bind(clienteController),
);
clienteRouter.delete('/:id', authMiddleware, clienteController.delete.bind(clienteController));

export default clienteRouter;
