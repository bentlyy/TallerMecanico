import { prisma } from '../db/prisma';

// Repositories
import { PrismaClienteRepository } from '../db/prismaClienteRepository';
import { PrismaVehiculoRepository } from '../db/prismaVehiculoRepository';
import { PrismaRolRepository } from '../db/prismaRolRepository';
import { PrismaUsuarioRepository } from '../db/prismaUsuarioRepository';
import { PrismaMecanicoRepository } from '../db/prismaMecanicoRepository';
import { PrismaPiezaRepository } from '../db/prismaPiezaRepository';
import { PrismaReparacionRepository } from '../db/prismaReparacionRepository';
import { PrismaDetalleReparacionRepository } from '../db/prismaDetalleReparacionRepository';
import { PrismaFacturaRepository } from '../db/prismaFacturaRepository';

// Services
import { ClienteService } from '../../application/clienteService';
import { VehiculoService } from '../../application/vehiculoService';
import { RolService } from '../../application/rolService';
import { UsuarioService } from '../../application/usuarioService';
import { MecanicoService } from '../../application/mecanicoService';
import { PiezaService } from '../../application/piezaService';
import { ReparacionService } from '../../application/reparacionService';
import { DetalleReparacionService } from '../../application/detalleReparacionService';
import { FacturaService } from '../../application/facturaService';

// Controllers
import { ClienteController } from '../../presentation/controllers/clienteController';
import { VehiculoController } from '../../presentation/controllers/vehiculoController';
import { RolController } from '../../presentation/controllers/rolController';
import { UsuarioController } from '../../presentation/controllers/usuarioController';
import { MecanicoController } from '../../presentation/controllers/mecanicoController';
import { PiezaController } from '../../presentation/controllers/piezaController';
import { ReparacionController } from '../../presentation/controllers/reparacionController';
import { DetalleReparacionController } from '../../presentation/controllers/detalleReparacionController';
import { FacturaController } from '../../presentation/controllers/facturaController';

// Instancias de Repositorios
const clienteRepository = new PrismaClienteRepository(prisma);
const vehiculoRepository = new PrismaVehiculoRepository(prisma);
const rolRepository = new PrismaRolRepository(prisma);
const usuarioRepository = new PrismaUsuarioRepository(prisma);
const mecanicoRepository = new PrismaMecanicoRepository(prisma);
const piezaRepository = new PrismaPiezaRepository(prisma);
const reparacionRepository = new PrismaReparacionRepository(prisma);
const detalleReparacionRepository = new PrismaDetalleReparacionRepository(prisma);
const facturaRepository = new PrismaFacturaRepository(prisma);

// Instancias de Servicios
const clienteService = new ClienteService(clienteRepository);
const vehiculoService = new VehiculoService(vehiculoRepository,clienteRepository);
const rolService = new RolService(rolRepository);
const usuarioService = new UsuarioService(usuarioRepository,rolService);
const mecanicoService = new MecanicoService(mecanicoRepository, usuarioService);
const piezaService = new PiezaService(piezaRepository);
const reparacionService = new ReparacionService(
  reparacionRepository,
  vehiculoService,
  mecanicoService,
  usuarioService,
  piezaService
);
const detalleReparacionService = new DetalleReparacionService(detalleReparacionRepository);
const facturaService = new FacturaService(facturaRepository);

// Instancias de Controladores
const clienteController = new ClienteController(clienteService);
const vehiculoController = new VehiculoController(vehiculoService);
const usuarioController = new UsuarioController(usuarioService);
const rolController = new RolController(rolService);
const mecanicoController = new MecanicoController(mecanicoService);
const piezaController = new PiezaController(piezaService);
const reparacionController = new ReparacionController(reparacionService);
const detalleReparacionController = new DetalleReparacionController(detalleReparacionService);
const facturaController = new FacturaController(facturaService);

// Exportaciones completas
export { 
  clienteRepository, clienteService, clienteController,
  vehiculoRepository, vehiculoService, vehiculoController,
  usuarioRepository, usuarioService, usuarioController,
  rolRepository, rolService, rolController,
  mecanicoRepository, mecanicoService, mecanicoController,
  piezaRepository, piezaService, piezaController,
  reparacionRepository, reparacionService, reparacionController,
  detalleReparacionRepository, detalleReparacionService, detalleReparacionController,
  facturaRepository, facturaService, facturaController
};