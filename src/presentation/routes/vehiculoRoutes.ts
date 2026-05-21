import { Router } from 'express';
import { vehiculoController } from '../../infrastructure/di/container';

const vehiculoRouter = Router();

vehiculoRouter.get('/', vehiculoController.getAll.bind(vehiculoController));
vehiculoRouter.get('/:id', vehiculoController.getById.bind(vehiculoController));
vehiculoRouter.post('/', vehiculoController.create.bind(vehiculoController));
vehiculoRouter.put('/:id', vehiculoController.update.bind(vehiculoController));
vehiculoRouter.delete('/:id', vehiculoController.delete.bind(vehiculoController));
vehiculoRouter.get('/cliente/:clienteId', vehiculoController.getByCliente.bind(vehiculoController));
vehiculoRouter.get('/:vehiculoId/reparaciones', vehiculoController.getReparaciones.bind(vehiculoController));

export default vehiculoRouter;
