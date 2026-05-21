import { Router } from 'express';
import { clienteController } from '../../infrastructure/di/container';

const clienteRouter = Router();

clienteRouter.get('/', clienteController.getAll.bind(clienteController));
clienteRouter.get('/:id', clienteController.getById.bind(clienteController));
clienteRouter.get('/email', clienteController.getByEmail.bind(clienteController));
clienteRouter.post('/', clienteController.create.bind(clienteController));
clienteRouter.put('/:id', clienteController.update.bind(clienteController));
clienteRouter.delete('/:id', clienteController.delete.bind(clienteController));

export default clienteRouter;