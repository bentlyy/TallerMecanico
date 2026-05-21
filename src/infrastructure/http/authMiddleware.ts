import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../../config/env';

const JWT_SECRET = config.jwtSecret;

export interface AuthRequest extends Request {
  usuario?: { id: number; email: string; rolId: number; empresaId: number; rolNombre: string };
}

export interface TokenPayload {
  id: number;
  email: string;
  rolId: number;
  empresaId: number;
  rolNombre: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token requerido' });
    return;
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.usuario = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

export function requireRol(...roles: string[]) {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.usuario) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    if (roles.length > 0 && !roles.includes(req.usuario.rolNombre)) {
      res.status(403).json({ error: 'No tienes permisos para esta acción' });
      return;
    }

    next();
  };
}

export const LOGIN_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
};
