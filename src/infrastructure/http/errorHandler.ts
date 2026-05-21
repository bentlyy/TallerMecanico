import { Request, Response, NextFunction } from 'express';
import { AppError } from './errors';
import logger from '../logger/logger';
import config from '../../../config/env';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }

  const prismaErr = err as any;
  if (prismaErr.code === 'P2002') {
    const target = prismaErr.meta?.target as string[] | undefined;
    res.status(409).json({ error: `Ya existe un registro con ese ${target ? target.join(', ') : 'campo'}` });
    return;
  }
  if (prismaErr.code === 'P2025') {
    res.status(404).json({ error: 'Registro no encontrado' });
    return;
  }
  if (prismaErr.code === 'P2024') {
    res.status(503).json({ error: 'Base de datos temporalmente no disponible' });
    return;
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({ error: 'Token inválido o expirado' });
    return;
  }

  logger.error({ err, req: { method: req.method, url: req.url } }, 'Unhandled error');

  res.status(500).json({
    error: config.nodeEnv === 'production' ? 'Error interno del servidor' : err.message,
  });
}
