import bcrypt from 'bcrypt';
import { generateToken } from '../http/authMiddleware';
import { prisma } from '../db/prisma';

import { PrismaClienteRepository } from '../db/prismaClienteRepository';
import { PrismaVehiculoRepository } from '../db/prismaVehiculoRepository';
import { PrismaRolRepository } from '../db/prismaRolRepository';
import { PrismaUsuarioRepository } from '../db/prismaUsuarioRepository';
import { PrismaMecanicoRepository } from '../db/prismaMecanicoRepository';
import { PrismaPiezaRepository } from '../db/prismaPiezaRepository';
import { PrismaReparacionRepository } from '../db/prismaReparacionRepository';
import { PrismaDetalleReparacionRepository } from '../db/prismaDetalleReparacionRepository';
import { PrismaFacturaRepository } from '../db/prismaFacturaRepository';

import { ClienteService } from '../../application/clienteService';
import { VehiculoService } from '../../application/vehiculoService';
import { RolService } from '../../application/rolService';
import { UsuarioService } from '../../application/usuarioService';
import { MecanicoService } from '../../application/mecanicoService';
import { PiezaService } from '../../application/piezaService';
import { ReparacionService } from '../../application/reparacionService';
import { DetalleReparacionService } from '../../application/detalleReparacionService';
import { FacturaService } from '../../application/facturaService';

import { ClienteController } from '../../presentation/controllers/clienteController';
import { VehiculoController } from '../../presentation/controllers/vehiculoController';
import { RolController } from '../../presentation/controllers/rolController';
import { UsuarioController } from '../../presentation/controllers/usuarioController';
import { MecanicoController } from '../../presentation/controllers/mecanicoController';
import { PiezaController } from '../../presentation/controllers/piezaController';
import { ReparacionController } from '../../presentation/controllers/reparacionController';
import { DetalleReparacionController } from '../../presentation/controllers/detalleReparacionController';
import { FacturaController } from '../../presentation/controllers/facturaController';

const clienteRepository = new PrismaClienteRepository(prisma);
const vehiculoRepository = new PrismaVehiculoRepository(prisma);
const rolRepository = new PrismaRolRepository(prisma);
const usuarioRepository = new PrismaUsuarioRepository(prisma);
const mecanicoRepository = new PrismaMecanicoRepository(prisma);
const piezaRepository = new PrismaPiezaRepository(prisma);
const reparacionRepository = new PrismaReparacionRepository(prisma);
const detalleReparacionRepository = new PrismaDetalleReparacionRepository(prisma);
const facturaRepository = new PrismaFacturaRepository(prisma);

const clienteService = new ClienteService(clienteRepository);
const vehiculoService = new VehiculoService(vehiculoRepository, clienteRepository);
const rolService = new RolService(rolRepository);
const usuarioService = new UsuarioService(usuarioRepository, rolService);
const mecanicoService = new MecanicoService(mecanicoRepository, usuarioService);
const piezaService = new PiezaService(piezaRepository);
const reparacionService = new ReparacionService(reparacionRepository);
const detalleReparacionService = new DetalleReparacionService(detalleReparacionRepository);
const facturaService = new FacturaService(facturaRepository);

const clienteController = new ClienteController(clienteService);
const vehiculoController = new VehiculoController(vehiculoService);
const usuarioController = new UsuarioController(usuarioService);
const rolController = new RolController(rolService);
const mecanicoController = new MecanicoController(mecanicoService);
const piezaController = new PiezaController(piezaService);
const reparacionController = new ReparacionController(reparacionService);
const detalleReparacionController = new DetalleReparacionController(detalleReparacionService);
const facturaController = new FacturaController(facturaService);

export async function loginService(
  email: string,
  password: string,
): Promise<{
  token: string;
  usuario: { id: number; email: string; nombre: string; rolId: number; rolNombre: string; empresaId: number };
} | null> {
  const user = await prisma.usuario.findFirst({
    where: { email },
    include: { rol: true, empresa: true },
  });
  if (!user) return null;
  if (!user.activo) return null;

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw new Error('Cuenta bloqueada temporalmente. Intenta de nuevo más tarde.');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const attempts = user.loginAttempts + 1;
    const updateData: any = { loginAttempts: attempts };
    if (attempts >= 5) {
      updateData.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
      updateData.loginAttempts = 0;
    }
    await prisma.usuario.update({ where: { id: user.id }, data: updateData });
    return null;
  }

  await prisma.usuario.update({
    where: { id: user.id },
    data: { loginAttempts: 0, lockedUntil: null },
  });

  const token = generateToken({
    id: user.id,
    email: user.email,
    rolId: user.rolId,
    empresaId: user.empresaId,
    rolNombre: user.rol.nombre,
  });

  return {
    token,
    usuario: {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      rolId: user.rolId,
      rolNombre: user.rol.nombre,
      empresaId: user.empresaId,
    },
  };
}

export {
  clienteRepository,
  clienteService,
  clienteController,
  vehiculoRepository,
  vehiculoService,
  vehiculoController,
  usuarioRepository,
  usuarioService,
  usuarioController,
  rolRepository,
  rolService,
  rolController,
  mecanicoRepository,
  mecanicoService,
  mecanicoController,
  piezaRepository,
  piezaService,
  piezaController,
  reparacionRepository,
  reparacionService,
  reparacionController,
  detalleReparacionRepository,
  detalleReparacionService,
  detalleReparacionController,
  facturaRepository,
  facturaService,
  facturaController,
};
