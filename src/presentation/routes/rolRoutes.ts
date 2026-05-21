import { Router } from 'express';
import { rolController } from '../../infrastructure/di/container';
import { authMiddleware, requireRol } from '../../infrastructure/http/authMiddleware';
import { validate, schemas } from '../../infrastructure/http/validationMiddleware';

const rolRouter = Router();

rolRouter.get('/', authMiddleware, requireRol('ADMIN'), rolController.getAll.bind(rolController));
rolRouter.get('/:id', authMiddleware, requireRol('ADMIN'), rolController.getById.bind(rolController));
rolRouter.post(
  '/',
  authMiddleware,
  requireRol('ADMIN'),
  validate({ body: schemas.rol.create }),
  rolController.create.bind(rolController),
);
rolRouter.put(
  '/:id',
  authMiddleware,
  requireRol('ADMIN'),
  validate({ body: schemas.rol.update }),
  rolController.update.bind(rolController),
);
rolRouter.delete('/:id', authMiddleware, requireRol('ADMIN'), rolController.delete.bind(rolController));

export default rolRouter;
