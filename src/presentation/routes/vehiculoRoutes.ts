import { Router } from 'express';
import { vehiculoController } from '../../infrastructure/di/container';
import { authMiddleware } from '../../infrastructure/http/authMiddleware';
import { validate, schemas } from '../../infrastructure/http/validationMiddleware';

const vehiculoRouter = Router();

vehiculoRouter.get('/', authMiddleware, vehiculoController.getAll.bind(vehiculoController));
vehiculoRouter.get('/:id', authMiddleware, vehiculoController.getById.bind(vehiculoController));
vehiculoRouter.post(
  '/',
  authMiddleware,
  validate({ body: schemas.vehiculo.create }),
  vehiculoController.create.bind(vehiculoController),
);
vehiculoRouter.put(
  '/:id',
  authMiddleware,
  validate({ body: schemas.vehiculo.update }),
  vehiculoController.update.bind(vehiculoController),
);
vehiculoRouter.delete('/:id', authMiddleware, vehiculoController.delete.bind(vehiculoController));
vehiculoRouter.get('/cliente/:clienteId', authMiddleware, vehiculoController.getByCliente.bind(vehiculoController));
vehiculoRouter.get(
  '/:vehiculoId/reparaciones',
  authMiddleware,
  vehiculoController.getReparaciones.bind(vehiculoController),
);

export default vehiculoRouter;
