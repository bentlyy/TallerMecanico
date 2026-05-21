import { Router } from 'express';
import { usuarioController } from '../../infrastructure/di/container';
import { authMiddleware, requireRol, LOGIN_RATE_LIMIT } from '../../infrastructure/http/authMiddleware';
import { ACCOUNT_CREATE_LIMIT } from '../../infrastructure/http/rateLimits';
import { validate, schemas } from '../../infrastructure/http/validationMiddleware';
import rateLimit from 'express-rate-limit';

const usuarioRouter = Router();
const loginLimiter = rateLimit(LOGIN_RATE_LIMIT);
const createUserLimiter = rateLimit(ACCOUNT_CREATE_LIMIT);

usuarioRouter.post(
  '/login',
  loginLimiter,
  validate({ body: schemas.login }),
  usuarioController.login.bind(usuarioController),
);

usuarioRouter.get('/', authMiddleware, requireRol('ADMIN'), usuarioController.getAll.bind(usuarioController));
usuarioRouter.get('/:id', authMiddleware, requireRol('ADMIN'), usuarioController.getById.bind(usuarioController));
usuarioRouter.post(
  '/',
  authMiddleware,
  requireRol('ADMIN'),
  createUserLimiter,
  validate({ body: schemas.usuario.create }),
  usuarioController.create.bind(usuarioController),
);
usuarioRouter.put(
  '/:id',
  authMiddleware,
  requireRol('ADMIN'),
  validate({ body: schemas.usuario.update }),
  usuarioController.update.bind(usuarioController),
);
usuarioRouter.delete('/:id', authMiddleware, requireRol('ADMIN'), usuarioController.delete.bind(usuarioController));
usuarioRouter.patch(
  '/:id/activate',
  authMiddleware,
  requireRol('ADMIN'),
  usuarioController.activate.bind(usuarioController),
);
usuarioRouter.patch(
  '/:id/deactivate',
  authMiddleware,
  requireRol('ADMIN'),
  usuarioController.deactivate.bind(usuarioController),
);

export default usuarioRouter;
