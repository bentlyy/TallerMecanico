import { Router } from 'express';
import { DetalleReparacionController } from '../controllers/detalleReparacionController';
import { DetalleReparacionService } from '../../application/detalleReparacionService';
import { PrismaDetalleReparacionRepository } from '../../infrastructure/db/prismaDetalleReparacionRepository';
import { PrismaReparacionRepository } from '../../infrastructure/db/prismaReparacionRepository';
import { PrismaPiezaRepository } from '../../infrastructure/db/prismaPiezaRepository';
import { ReparacionService } from '../../application/reparacionService';
import { PiezaService } from '../../application/piezaService';
import { prisma } from '../../infrastructure/db/prisma';
import { VehiculoService } from '../../application/vehiculoService';
import { MecanicoService } from '../../application/mecanicoService';
import { UsuarioService } from '../../application/usuarioService';
import { PrismaVehiculoRepository } from '../../infrastructure/db/prismaVehiculoRepository';
import { PrismaMecanicoRepository } from '../../infrastructure/db/prismaMecanicoRepository';
import { PrismaUsuarioRepository } from '../../infrastructure/db/prismaUsuarioRepository';
import { PrismaClienteRepository } from '../../infrastructure/db/prismaClienteRepository';
import { PrismaRolRepository } from '../../infrastructure/db/prismaRolRepository';
import { RolService } from '../../application/rolService';

// Inicialización de todos los repositorios necesarios
const detalleReparacionRepository = new PrismaDetalleReparacionRepository(prisma);
const reparacionRepository = new PrismaReparacionRepository(prisma);
const piezaRepository = new PrismaPiezaRepository(prisma);
const vehiculoRepository = new PrismaVehiculoRepository(prisma);
const mecanicoRepository = new PrismaMecanicoRepository(prisma);
const usuarioRepository = new PrismaUsuarioRepository(prisma);
const clienteRepository = new PrismaClienteRepository(prisma);
const rolRepository = new PrismaRolRepository(prisma);

// Inicialización de los servicios necesarios en el orden correcto
const rolService = new RolService(rolRepository);
const usuarioService = new UsuarioService(usuarioRepository, rolService);
const piezaService = new PiezaService(piezaRepository);
const vehiculoService = new VehiculoService(vehiculoRepository, clienteRepository);
const mecanicoService = new MecanicoService(mecanicoRepository, usuarioService); // Ahora pasa usuarioService en lugar de usuarioRepository

const reparacionService = new ReparacionService(
  reparacionRepository,
  vehiculoService,
  mecanicoService,
  usuarioService,
  piezaService
);

const detalleReparacionService = new DetalleReparacionService(
  detalleReparacionRepository,
  reparacionService,
  piezaService
);

const controller = new DetalleReparacionController(detalleReparacionService);

const detalleReparacionRouter = Router();

// Rutas (se mantienen igual)
detalleReparacionRouter.get('/', controller.getAll.bind(controller));
detalleReparacionRouter.get('/:id', controller.getById.bind(controller));
detalleReparacionRouter.post('/', controller.create.bind(controller));
detalleReparacionRouter.put('/:id', controller.update.bind(controller));
detalleReparacionRouter.delete('/:id', controller.delete.bind(controller));
detalleReparacionRouter.get('/reparacion/:reparacionId', controller.getByReparacion.bind(controller));
detalleReparacionRouter.get('/pieza/:piezaId', controller.getByPieza.bind(controller));
detalleReparacionRouter.patch('/:id/cantidad', controller.updateCantidad.bind(controller));

export default detalleReparacionRouter;