import { Router } from 'express';
import { DetalleReparacionController } from '../controllers/detalleReparacionController';
import { DetalleReparacionService } from '../../application/detalleReparacionService';
import { PrismaDetalleReparacionRepository } from '../../infrastructure/db/prismaDetalleReparacionRepository';
import { prisma } from '../../infrastructure/db/prisma';

const detalleRouter = Router();

const repository = new PrismaDetalleReparacionRepository(prisma);
const service = new DetalleReparacionService(repository);
const controller = new DetalleReparacionController(service);

// Rutas para detalles de reparación
detalleRouter.post('/reparacion/:reparacionId/detalle', controller.agregar.bind(controller));
detalleRouter.delete('/reparacion/:reparacionId/detalle/:piezaId', controller.eliminar.bind(controller));
detalleRouter.put('/reparacion/:reparacionId/detalle/:piezaId', controller.actualizar.bind(controller));
detalleRouter.get('/reparacion/:reparacionId/detalles', controller.getDetalles.bind(controller));
detalleRouter.get('/reparacion/:reparacionId/total-repuestos', controller.calcularTotal.bind(controller));

export default detalleRouter;