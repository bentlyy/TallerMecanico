import { prisma } from '../db/prisma';

import { PrismaClienteRepository } from '../db/prismaClienteRepository';
import { ClienteService } from '../../application/clienteService';
import { ClienteController } from '../../presentation/controllers/clienteController';

import { PrismaVehiculoRepository } from '../db/prismaVehiculoRepository';
import { VehiculoService } from '../../application/vehiculoService';
import { VehiculoController } from '../../presentation/controllers/vehiculoController';

import { PrismaUsuarioRepository } from '../db/prismaUsuarioRepository';
import { UsuarioService } from '../../application/usuarioService';
import { UsuarioController } from '../../presentation/controllers/usuarioController'

import { PrismaRolRepository } from '../db/prismaRolRepository';
import { RolService } from '../../application/rolService';
import { RolController } from '../../presentation/controllers/rolController';

import { PrismaMecanicoRepository } from '../db/prismaMecanicoRepository';
import { MecanicoService } from '../../application/mecanicoService';
import { MecanicoController } from '../../presentation/controllers/mecanicoController';

import { PrismaPiezaRepository } from '../db/prismaPiezaRepository';
import { PiezaService } from '../../application/piezaService';
import { PiezaController } from '../../presentation/controllers/piezaController'

import { PrismaReparacionRepository } from '../db/prismaReparacionRepository';
import { ReparacionService } from '../../application/reparacionService';
import { ReparacionController } from '../../presentation/controllers/reparacionController';

import { PrismaDetalleReparacionRepository } from '../db/prismaDetalleReparacionRepository';
import { DetalleReparacionService } from '../../application/detalleReparacionService';
import { DetalleReparacionController } from '../../presentation/controllers/detalleReparacionController';

import { PrismaFacturaRepository } from '../db/prismaFacturaRepository';
import { FacturaService } from '../../application/facturaService';
import { FacturaController } from '../../presentation/controllers/facturaController';

// Registro del módulo de clientes
const clienteRepository = new PrismaClienteRepository(prisma);
const clienteService = new ClienteService(clienteRepository);
const clienteController = new ClienteController(clienteService);

const vehiculoRepository = new PrismaVehiculoRepository(prisma);
const vehiculoService = new VehiculoService(vehiculoRepository);
const vehiculoController = new VehiculoController(vehiculoService);

const usuarioRepository = new PrismaUsuarioRepository(prisma);
const usuarioService = new UsuarioService(usuarioRepository);
const usuarioController = new UsuarioController(usuarioService);

const rolRepository = new PrismaRolRepository(prisma);
const rolService = new RolService(rolRepository);
const rolController = new RolController(rolService);

const mecanicoRepository = new PrismaMecanicoRepository(prisma);
const mecanicoService = new MecanicoService(mecanicoRepository);
const mecanicoController = new MecanicoController(mecanicoService);

const piezaRepository = new PrismaPiezaRepository(prisma);
const piezaService = new PiezaService(piezaRepository);
const piezaController = new PiezaController(piezaService);

const reparacionRepository = new PrismaReparacionRepository(prisma);
const reparacionService = new ReparacionService(reparacionRepository);
const reparacionController = new ReparacionController(reparacionService);

const detalleReparacionRepository = new PrismaDetalleReparacionRepository(prisma);
const detalleReparacionService = new DetalleReparacionService(detalleReparacionRepository);
const detalleReparacionController = new DetalleReparacionController(detalleReparacionService);

const facturaRepository = new PrismaFacturaRepository(prisma);
const facturaService = new FacturaService(facturaRepository);
const facturaController = new FacturaController(facturaService);

export { clienteRepository, clienteService, clienteController };
export { vehiculoRepository, vehiculoService, vehiculoController };
export { usuarioRepository, usuarioService, usuarioController };
export { rolRepository, rolService, rolController };
export { mecanicoRepository, mecanicoService, mecanicoController };
export { piezaRepository, piezaService, piezaController };
export { reparacionRepository, reparacionService, reparacionController };
export { detalleReparacionRepository, detalleReparacionService, detalleReparacionController };
export { facturaRepository, facturaService, facturaController };




// import { PrismaClienteRepository } from "../db/prismaClienteRepository";
// import { PrismaVehiculoRepository } from "../db/prismaVehiculoRepository";
// import { PrismaUsuarioRepository } from "../db/prismaUsuarioRepository";
// import { PrismaRolRepository } from "../db/prismaRolRepository";
// import { PrismaMecanicoRepository } from "../db/prismaMecanicoRepository";
// import { PrismaPiezaRepository } from "../db/prismaPiezaRepository";
// import { PrismaReparacionRepository } from "../db/prismaReparacionRepository";
// import { PrismaDetalleReparacionRepository } from "../db/prismaDetalleReparacionRepository";
// import { PrismaFacturaRepository } from "../db/prismaFacturaRepository";


// import { ClienteService } from "../../application/clienteService";
// import { VehiculoService } from "../../application/vehiculoService";
// import { UsuarioService } from "../../application/usuarioService";
// import { RolService } from "../../application/rolService";
// import { MecanicoService } from "../../application/mecanicoService";
// import { PiezaService } from "../../application/piezaService";
// import { ReparacionService } from "../../application/reparacionService";
// import { DetalleReparacionService } from "../../application/detalleReparacionService";
// import { FacturaService } from "../../application/facturaService";


// const clienteRepository = new PrismaClienteRepository();
// const clienteService = new ClienteService(clienteRepository);

// const vehiculoRepository = new PrismaVehiculoRepository();
// const vehiculoService = new VehiculoService(vehiculoRepository);

// const usuarioRepository = new PrismaUsuarioRepository();
// const usuarioService = new UsuarioService(usuarioRepository);

// const rolRepository = new PrismaRolRepository();
// const rolService = new RolService(rolRepository);

// const mecanicoRepository = new PrismaMecanicoRepository();
// const mecanicoService = new MecanicoService(mecanicoRepository);

// const piezaRepository = new PrismaPiezaRepository();
// const piezaService = new PiezaService(piezaRepository);

// const reparacionRepository = new PrismaReparacionRepository();
// const reparacionService = new ReparacionService(reparacionRepository);

// const detalleReparacionRepository = new PrismaDetalleReparacionRepository();
// const detalleReparacionService = new DetalleReparacionService(detalleReparacionRepository);

// const facturaRepository = new PrismaFacturaRepository();
// const facturaService = new FacturaService(facturaRepository);


// export const container = {
//   clienteService,
//   vehiculoService,
//   usuarioService,
//   rolService,
//   mecanicoService,
//   piezaService,
//   detalleReparacionService,
//   facturaService,
// };
