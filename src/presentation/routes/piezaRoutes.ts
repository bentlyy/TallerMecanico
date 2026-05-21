import { Router } from 'express';
import { piezaController } from '../../infrastructure/di/container';
import { authMiddleware } from '../../infrastructure/http/authMiddleware';
import { validate, schemas } from '../../infrastructure/http/validationMiddleware';

const piezaRouter = Router();

piezaRouter.get('/', authMiddleware, piezaController.getAll.bind(piezaController));
piezaRouter.get('/:id', authMiddleware, piezaController.getById.bind(piezaController));
piezaRouter.get('/codigo/:codigo', authMiddleware, piezaController.getByCodigo.bind(piezaController));
piezaRouter.post(
  '/',
  authMiddleware,
  validate({ body: schemas.pieza.create }),
  piezaController.create.bind(piezaController),
);
piezaRouter.put(
  '/:id',
  authMiddleware,
  validate({ body: schemas.pieza.update }),
  piezaController.update.bind(piezaController),
);
piezaRouter.delete('/:id', authMiddleware, piezaController.delete.bind(piezaController));
piezaRouter.patch('/:id/stock', authMiddleware, piezaController.updateStock.bind(piezaController));

export default piezaRouter;
