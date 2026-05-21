import { Router } from 'express';
import { mecanicoController } from '../../infrastructure/di/container';
import { authMiddleware } from '../../infrastructure/http/authMiddleware';
import { validate, schemas } from '../../infrastructure/http/validationMiddleware';

const mecanicoRouter = Router();

mecanicoRouter.get('/', authMiddleware, mecanicoController.getAll.bind(mecanicoController));
mecanicoRouter.get('/:id', authMiddleware, mecanicoController.getById.bind(mecanicoController));
mecanicoRouter.post(
  '/',
  authMiddleware,
  validate({ body: schemas.mecanico.create }),
  mecanicoController.create.bind(mecanicoController),
);
mecanicoRouter.put(
  '/:id',
  authMiddleware,
  validate({ body: schemas.mecanico.update }),
  mecanicoController.update.bind(mecanicoController),
);
mecanicoRouter.delete('/:id', authMiddleware, mecanicoController.delete.bind(mecanicoController));

export default mecanicoRouter;
