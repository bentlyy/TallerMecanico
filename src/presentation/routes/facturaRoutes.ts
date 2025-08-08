// src/presentation/routes/facturaRoutes.ts
import { Router } from 'express';
import { FacturaController } from '../controllers/facturaController';
import { FacturaService } from '../../application/facturaService';
import { PrismaFacturaRepository } from '../../infrastructure/db/prismaFacturaRepository';
import { prisma } from '../../infrastructure/db/prisma';

const facturaRouter = Router();

const repository = new PrismaFacturaRepository(prisma);
const service = new FacturaService(repository);
const controller = new FacturaController(service);

// ⚠️ Primero las rutas específicas
facturaRouter.get('/cliente/:clienteId', controller.getByCliente.bind(controller));
facturaRouter.get('/reparacion/:reparacionId', controller.getByReparacion.bind(controller));

// Luego las rutas genéricas
facturaRouter.get('/', controller.getAll.bind(controller));
facturaRouter.get('/:id', controller.getById.bind(controller));
facturaRouter.post('/', controller.create.bind(controller));

export default facturaRouter;
