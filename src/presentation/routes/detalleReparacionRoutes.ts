import { Router } from 'express';
import { authMiddleware } from '../../infrastructure/http/authMiddleware';
import { validate, schemas } from '../../infrastructure/http/validationMiddleware';
import { DetalleReparacionController } from '../controllers/detalleReparacionController';
import { detalleReparacionService } from '../../infrastructure/di/container';

const router = Router();
const controller = new DetalleReparacionController(detalleReparacionService);

router.post(
  '/',
  authMiddleware,
  validate({ body: schemas.detalleReparacion.create }),
  controller.agregarDetalle.bind(controller),
);
router.delete('/:reparacionId/:piezaId', authMiddleware, controller.eliminarDetalle.bind(controller));
router.put(
  '/:reparacionId/:piezaId',
  authMiddleware,
  validate({ body: schemas.detalleReparacion.update }),
  controller.actualizarDetalle.bind(controller),
);
router.get('/:reparacionId', authMiddleware, controller.getDetallesDeReparacion.bind(controller));
router.get('/:reparacionId/total', authMiddleware, controller.calcularTotalRepuestos.bind(controller));

export default router;
