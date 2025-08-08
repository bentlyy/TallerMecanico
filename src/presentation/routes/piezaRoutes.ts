// src/presentation/routes/piezaRoutes.ts
import { Router } from 'express';
import { piezaController } from '../../infrastructure/di/container';

const piezaRouter = Router();

piezaRouter.get('/', piezaController.getAll.bind(piezaController));
piezaRouter.get('/:id', piezaController.getById.bind(piezaController));
piezaRouter.get('/codigo/:codigo', piezaController.getByCodigo.bind(piezaController));
piezaRouter.post('/', piezaController.create.bind(piezaController));
piezaRouter.put('/:id', piezaController.update.bind(piezaController));
piezaRouter.delete('/:id', piezaController.delete.bind(piezaController));
piezaRouter.patch('/:id/stock', piezaController.updateStock.bind(piezaController));

export default piezaRouter;
