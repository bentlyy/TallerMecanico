import { Router } from 'express';
import { rolController } from '../../infrastructure/di/container';

const rolRouter = Router();

rolRouter.get('/', rolController.getAll.bind(rolController));
rolRouter.get('/:id', rolController.getById.bind(rolController));
rolRouter.post('/', rolController.create.bind(rolController));
rolRouter.put('/:id', rolController.update.bind(rolController));
rolRouter.delete('/:id', rolController.delete.bind(rolController));

export default rolRouter;