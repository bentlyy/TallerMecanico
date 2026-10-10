import { Router } from 'express';
import { servicioController } from '../../infrastructure/di/container';
import { authMiddleware, requireRol } from '../../infrastructure/http/authMiddleware';
import { validate, schemas } from '../../infrastructure/http/validationMiddleware';

const servicioRouter = Router();

servicioRouter.get('/', authMiddleware, servicioController.getAll.bind(servicioController));
servicioRouter.get('/:id', authMiddleware, servicioController.getById.bind(servicioController));
servicioRouter.post(
  '/',
  authMiddleware,
  requireRol('ADMIN'),
  validate({ body: schemas.servicio.create }),
  servicioController.create.bind(servicioController),
);
servicioRouter.put(
  '/:id',
  authMiddleware,
  requireRol('ADMIN'),
  validate({ body: schemas.servicio.update }),
  servicioController.update.bind(servicioController),
);
servicioRouter.delete('/:id', authMiddleware, requireRol('ADMIN'), servicioController.delete.bind(servicioController));

export default servicioRouter;
