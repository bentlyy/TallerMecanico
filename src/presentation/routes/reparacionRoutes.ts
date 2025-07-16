import { Router } from 'express';
import { ReparacionController } from '../controllers/reparacionController';
import { ReparacionService } from '../../application/reparacionService';
import { PrismaReparacionRepository } from '../../infrastructure/db/prismaReparacionRepository';
import { prisma } from '../../infrastructure/db/prisma';

const reparacionRouter = Router();

const repository = new PrismaReparacionRepository(prisma);
const service = new ReparacionService(repository);
const controller = new ReparacionController(service);

// Rutas CRUD básicas
reparacionRouter.get('/', controller.getAll.bind(controller));
reparacionRouter.get('/:id', controller.getById.bind(controller));
reparacionRouter.post('/', controller.create.bind(controller));
reparacionRouter.put('/:id', controller.update.bind(controller));
reparacionRouter.delete('/:id', controller.delete.bind(controller));

// Rutas específicas
reparacionRouter.patch('/:id/estado', controller.cambiarEstado.bind(controller));
reparacionRouter.patch('/:id/mecanico', controller.asignarMecanico.bind(controller));
reparacionRouter.patch('/:id/salida', controller.registrarSalida.bind(controller));
reparacionRouter.get('/:id/detalles', controller.getDetalles.bind(controller));
reparacionRouter.get('/vehiculo/:vehiculoId', controller.getByVehiculo.bind(controller));
reparacionRouter.get('/mecanico/:mecanicoId', controller.getByMecanico.bind(controller));
reparacionRouter.get('/recepcionista/:usuarioId', controller.getByRecepcionista.bind(controller));

export default reparacionRouter;