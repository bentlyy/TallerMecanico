import { Router } from 'express';
import { facturaController } from '../../infrastructure/di/container';
import { authMiddleware } from '../../infrastructure/http/authMiddleware';
import { validate, schemas } from '../../infrastructure/http/validationMiddleware';

const facturaRouter = Router();

facturaRouter.get('/cliente/:clienteId', authMiddleware, facturaController.getByCliente.bind(facturaController));
facturaRouter.get(
  '/reparacion/:reparacionId',
  authMiddleware,
  facturaController.getByReparacion.bind(facturaController),
);

facturaRouter.get('/', authMiddleware, facturaController.getAll.bind(facturaController));
facturaRouter.get('/:id', authMiddleware, facturaController.getById.bind(facturaController));
facturaRouter.post(
  '/',
  authMiddleware,
  validate({ body: schemas.factura.create }),
  facturaController.create.bind(facturaController),
);

export default facturaRouter;
