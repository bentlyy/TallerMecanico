import { Request, Response, NextFunction } from 'express';

interface PrismaError extends Error {
  code?: string;
  meta?: Record<string, unknown>;
}

export function errorHandler(err: PrismaError, req: Request, res: Response, _next: NextFunction): void {
  console.error('[ErrorHandler]', err.message);

  if (err.code === 'P2002') {
    const target = err.meta?.target as string[] | undefined;
    const field = target ? target.join(', ') : 'campo';
    res.status(409).json({ error: `Ya existe un registro con ese ${field}` });
    return;
  }

  if (err.code === 'P2025') {
    res.status(404).json({ error: 'Registro no encontrado' });
    return;
  }

  res.status(500).json({ error: 'Error interno del servidor' });
}
