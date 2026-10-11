import 'dotenv/config';
import { Router, type Request, type Response } from 'express';
import type { AmgAuthClient, AmgResolvedConfig } from './amgTypes';
import { resolveLocalUser } from './localAccount';

// `@amg/auth-client` es ESM; el taller es CommonJS/Node 20. `require` resuelve el
// build CJS (condición "require" del paquete) y evita arrastrar sus tipos de
// Express 4, tipados localmente en ./amgTypes.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildLoginUrl, identity: amgIdentity, loadConfig, mountAmgAuth } = require('@amg/auth-client') as AmgAuthClient;

export { buildLoginUrl };

/**
 * Integración SSO del taller con el Core.
 *
 * El taller ya no autentica: `mountAmgAuth` valida la cookie `app_session` que
 * el Core emitió en /auth/callback, pone `req.amg` (identidad verificada) y
 * redirige al login central cuando no hay sesión. Este archivo solo lo monta y
 * expone las rutas que la aplicación (SPA) necesita:
 *
 *   GET /api/auth/login   -> 302 al login del Core (vuelve con return_to=/)
 *   GET /api/auth/me      -> identidad del Core (depuración / API)
 *   GET /api/auth/inicio  -> el shell: usuario local + organización + tools
 *   GET /auth/logout      -> cierra sesión (lo atiende mountAmgAuth)
 *   GET /auth/callback    -> canjea el código SSO (lo atiende mountAmgAuth)
 */

/** Config SSO del taller. Fail-fast si falta el secreto. */
export const ssoConfig: AmgResolvedConfig = loadConfig(process.env, 'taller');

/** Rutas que no requieren sesión. El resto las exige mountAmgAuth. */
export const amgPublicPaths: (string | RegExp)[] = [
  '/health',
  '/',
  '/api-docs',
  '/api-docs.json',
  '/favicon.ico',
  '/api/auth/login',
];

export const amgRouter = Router();

amgRouter.get('/auth/login', (req: Request, res: Response) => {
  res.redirect(302, buildLoginUrl(ssoConfig, '/'));
});

amgRouter.get('/auth/me', (req: Request, res: Response) => {
  res.json(amgIdentity(req));
});

amgRouter.get('/auth/inicio', async (req: Request, res: Response) => {
  const identity = amgIdentity(req);
  const usuario = await resolveLocalUser(identity);
  const herramientas =
    identity.tools && identity.tools.length > 0
      ? identity.tools
      : [{ slug: identity.product, name: 'Taller Mecánico', url: ssoConfig.productUrl }];
  res.json({
    usuario,
    organizacion: {
      id: identity.organizationId,
      slug: identity.organizationSlug,
      nombre: identity.organizationName,
    },
    rol: identity.role,
    herramienta: identity.product,
    herramientas,
  });
});

/** Monta la identidad del Core en la app. Debe ir antes de las rutas. */
export function mountAmgAuthMiddleware() {
  return mountAmgAuth(ssoConfig, {
    publicPaths: amgPublicPaths,
    productName: 'Taller Mecánico',
  });
}
