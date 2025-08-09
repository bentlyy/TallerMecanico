// src/presentation/routes/facturaRoutes.ts
import { Router } from 'express';
import { facturaController } from '../../infrastructure/di/container';

const facturaRouter = Router();

// ⚠️ Primero las rutas específicas
facturaRouter.get('/cliente/:clienteId', facturaController.getByCliente.bind(facturaController));
facturaRouter.get('/reparacion/:reparacionId', facturaController.getByReparacion.bind(facturaController));

// Luego las rutas genéricas
facturaRouter.get('/', facturaController.getAll.bind(facturaController));
facturaRouter.get('/:id', facturaController.getById.bind(facturaController));
facturaRouter.post('/', facturaController.create.bind(facturaController));

export default facturaRouter;
