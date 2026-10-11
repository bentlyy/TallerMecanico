import { Request, Response, NextFunction } from 'express';
import type { AmgIdentity } from '../sso/amgTypes';
import { buildLoginUrl, ssoConfig } from '../sso/amgSso';
import { resolveLocalUser, type LocalAccount } from '../sso/localAccount';

/**
 * Identidad del usuario de la aplicación, desde el Core.
 *
 * La forma se mantiene igual que el `req.usuario` de siempre ({ id, email,
 * rolId, empresaId, rolNombre, plan }), pero el origen ya no es un JWT local:
 * es la identidad SSO verificada por mountAmgAuth (req.amg) traducida a la
 * cuenta local del taller.
 */
export interface AuthRequest extends Request {
  usuario?: LocalAccount;
}

/**
 * Protege una ruta con la identidad del Core.
 *
 * mountAmgAuth (montado a nivel de app) ya validó la cookie y dejó `req.amg`.
 * Este middleware resuelve la cuenta local del taller y la deja en
 * `req.usuario`, igual que hacía el middleware de JWT anterior.
 */
export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const amg = req.amg as AmgIdentity | undefined;
  if (!amg) {
    res.status(401).json({
      error: 'sin-sesion',
      message: 'Tu sesión expiró o no existe. Iniciá sesión para continuar.',
      loginUrl: buildLoginUrl(ssoConfig, '/'),
    });
    return;
  }

  try {
    req.usuario = await resolveLocalUser(amg);
    next();
  } catch (err) {
    next(err);
  }
}

/** Restricción por rol del taller (ADMIN, OPERADOR, ...). */
export function requireRol(...roles: string[]) {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.usuario) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    if (roles.length > 0 && !roles.includes(req.usuario.rolNombre ?? '')) {
      res.status(403).json({ error: 'No tienes permisos para esta acción' });
      return;
    }

    next();
  };
}

/** Restricción por plan del taller (legacy: el acceso real lo decide el Core). */
export function requirePremium(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.usuario) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }
  if (req.usuario.plan !== 'PREMIUM') {
    res.status(403).json({ error: 'Función disponible solo en el plan Premium' });
    return;
  }
  next();
}
