import { randomUUID } from 'crypto';
import { prisma } from '../db/prisma';
import type { AmgIdentity } from './amgTypes';

/**
 * Cuenta local del taller: qué fila de `usuarios` y `empresas` corresponde a la
 * identidad que vino del Core.
 *
 * El taller ya no guarda contraseñas ni tiene login propio: el Core decide quién
 * puede entrar (y solo emite SSO si la organización tiene la suscripción
 * activa). Acá solo se traduce la identidad del Core a las filas que el negocio
 * del taller sigue usando:
 *
 *   organizacion del Core  ->  empresa (por sso_org_id)
 *   usuario del Core       ->  usuario (por sso_sub)
 *
 * Si la organización/usuario todavía no tienen fila (cliente nuevo que entró
 * desde el Core), se crean al vuelo. Si ya existen con datos sembrados a mano,
 * se enlazan (migración de cuentas existentes).
 */
export interface LocalAccount {
  id: number;
  email: string;
  nombre: string;
  rolId: number;
  rolNombre: string | null;
  empresaId: number;
  plan: 'NORMAL' | 'PREMIUM';
}

async function rolIdPara(rolCore: AmgIdentity['role']): Promise<number> {
  // El rol de plataforma del Core decide el permiso por defecto dentro del
  // taller: los que pueden administrar (owner/admin) entran como ADMIN; los
  // que solo usan el producto entran como OPERADOR. Los permisos finos siguen
  // siendo del taller (ver SSO.md del Core).
  const nombre = rolCore === 'member' ? 'OPERADOR' : 'ADMIN';
  const rol = await prisma.rol.findFirst({ where: { nombre } });
  if (rol) return rol.id;
  const cualquiera = await prisma.rol.findFirst({ orderBy: { id: 'asc' } });
  if (cualquiera) return cualquiera.id;
  throw new Error('No existe ningún rol en la base del taller');
}

/**
 * Resuelve la empresa que corresponde a la organización del Core.
 * La crea la primera vez que el cliente entra (con plan PREMIUM: el acceso ya
 * lo decide la suscripción del Core, no un plan local).
 */
async function resolverEmpresa(identity: AmgIdentity): Promise<{ id: number; plan: 'NORMAL' | 'PREMIUM' }> {
  const orgId = identity.organizationId;
  const existente = await prisma.empresa.findUnique({ where: { ssoOrgId: orgId } });
  if (existente) {
    return { id: existente.id, plan: existente.plan };
  }
  const creada = await prisma.empresa.create({
    data: {
      nombre: identity.organizationName || 'Mi Taller',
      plan: 'PREMIUM',
      ssoOrgId: orgId,
    },
  });
  return { id: creada.id, plan: creada.plan };
}

/** Resuelve (o crea/enlaza) el usuario local a partir de la identidad del Core. */
async function resolverUsuario(
  identity: AmgIdentity,
  empresa: { id: number; plan: 'NORMAL' | 'PREMIUM' },
): Promise<{ id: number; rolId: number; rolNombre: string | null; plan: 'NORMAL' | 'PREMIUM' }> {
  const userId = identity.userId;
  const existente = await prisma.usuario.findUnique({ where: { ssoSub: userId }, include: { rol: true } });
  if (existente) {
    return {
      id: existente.id,
      rolId: existente.rolId,
      rolNombre: existente.rol?.nombre ?? null,
      plan: empresa.plan,
    };
  }

  const porEmail = await prisma.usuario.findFirst({
    where: { email: identity.email, empresaId: empresa.id },
    include: { rol: true },
  });
  if (porEmail) {
    const enlazado = await prisma.usuario.update({
      where: { id: porEmail.id },
      data: { ssoSub: userId },
      include: { rol: true },
    });
    return {
      id: enlazado.id,
      rolId: enlazado.rolId,
      rolNombre: enlazado.rol?.nombre ?? null,
      plan: empresa.plan,
    };
  }

  const creado = await prisma.usuario.create({
    data: {
      email: identity.email,
      passwordHash: randomUUID(),
      nombre: identity.name || identity.email || 'Usuario',
      activo: true,
      rolId: await rolIdPara(identity.role),
      empresaId: empresa.id,
      ssoSub: userId,
    },
    include: { rol: true },
  });
  return {
    id: creado.id,
    rolId: creado.rolId,
    rolNombre: creado.rol?.nombre ?? null,
    plan: empresa.plan,
  };
}

/** El `req.usuario` de siempre, ahora construido desde la identidad del Core. */
export async function resolveLocalUser(identity: AmgIdentity): Promise<LocalAccount> {
  const empresa = await resolverEmpresa(identity);
  const usuario = await resolverUsuario(identity, empresa);
  return {
    id: usuario.id,
    email: identity.email,
    nombre: identity.name || identity.email || 'Usuario',
    rolId: usuario.rolId,
    rolNombre: usuario.rolNombre,
    empresaId: empresa.id,
    plan: usuario.plan,
  };
}
