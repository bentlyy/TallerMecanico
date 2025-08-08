// src/presentation/routes/detalleReparacionRoutes.ts
import { Router } from 'express';
import { DetalleReparacionController } from '../controllers/detalleReparacionController';
import { detalleReparacionService } from '../../infrastructure/di/container'; // Ajusta el path según tu contenedor DI

const router = Router();
const controller = new DetalleReparacionController(detalleReparacionService);

router.post('/', controller.agregarDetalle.bind(controller));
router.delete('/:reparacionId/:piezaId', controller.eliminarDetalle.bind(controller));
router.put('/:reparacionId/:piezaId', controller.actualizarDetalle.bind(controller));
router.get('/:reparacionId', controller.getDetallesDeReparacion.bind(controller));
router.get('/:reparacionId/total', controller.calcularTotalRepuestos.bind(controller));

export default router;
