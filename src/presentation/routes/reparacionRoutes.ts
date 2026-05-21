import { Router } from 'express';
import { reparacionController } from '../../infrastructure/di/container';
import { authMiddleware } from '../../infrastructure/http/authMiddleware';
import { validate, schemas } from '../../infrastructure/http/validationMiddleware';

const router = Router();

router.get('/', authMiddleware, reparacionController.getAll.bind(reparacionController));
router.get('/:id', authMiddleware, reparacionController.getById.bind(reparacionController));
router.post(
  '/',
  authMiddleware,
  validate({ body: schemas.reparacion.create }),
  reparacionController.create.bind(reparacionController),
);
router.put(
  '/:id',
  authMiddleware,
  validate({ body: schemas.reparacion.update }),
  reparacionController.update.bind(reparacionController),
);
router.delete('/:id', authMiddleware, reparacionController.delete.bind(reparacionController));

router.patch('/:id/estado', authMiddleware, reparacionController.cambiarEstado.bind(reparacionController));
router.patch('/:id/mecanico', authMiddleware, reparacionController.asignarMecanico.bind(reparacionController));
router.patch('/:id/salida', authMiddleware, reparacionController.registrarSalida.bind(reparacionController));

router.get('/vehiculo/:vehiculoId', authMiddleware, reparacionController.getPorVehiculo.bind(reparacionController));
router.get('/mecanico/:mecanicoId', authMiddleware, reparacionController.getPorMecanico.bind(reparacionController));
router.get(
  '/recepcionista/:usuarioId',
  authMiddleware,
  reparacionController.getPorRecepcionista.bind(reparacionController),
);

export default router;
