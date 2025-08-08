// src/presentation/routes/reparacionRoutes.ts
import { Router } from 'express';
import { reparacionController } from '../../infrastructure/di/container';

const router = Router();

router.get('/', reparacionController.getAll.bind(reparacionController));
router.get('/:id', reparacionController.getById.bind(reparacionController));
router.post('/', reparacionController.create.bind(reparacionController));
router.put('/:id', reparacionController.update.bind(reparacionController));
router.delete('/:id', reparacionController.delete.bind(reparacionController));

router.patch('/:id/estado', reparacionController.cambiarEstado.bind(reparacionController));
router.patch('/:id/mecanico', reparacionController.asignarMecanico.bind(reparacionController));
router.patch('/:id/salida', reparacionController.registrarSalida.bind(reparacionController));

router.get('/vehiculo/:vehiculoId', reparacionController.getPorVehiculo.bind(reparacionController));
router.get('/mecanico/:mecanicoId', reparacionController.getPorMecanico.bind(reparacionController));
router.get('/recepcionista/:usuarioId', reparacionController.getPorRecepcionista.bind(reparacionController));

export default router;
