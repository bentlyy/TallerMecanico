import { Router } from 'express';
import { ubicacionController } from '../../infrastructure/di/container';
import { authMiddleware, requirePremium } from '../../infrastructure/http/authMiddleware';
import { validate, schemas } from '../../infrastructure/http/validationMiddleware';

const router = Router();

router.use(authMiddleware);
router.use(requirePremium);

router.get('/', ubicacionController.getAll.bind(ubicacionController));
router.post('/', validate({ body: schemas.ubicacion.create }), ubicacionController.create.bind(ubicacionController));
router.put('/:id', validate({ body: schemas.ubicacion.update }), ubicacionController.update.bind(ubicacionController));
router.delete('/:id', ubicacionController.delete.bind(ubicacionController));

export default router;
