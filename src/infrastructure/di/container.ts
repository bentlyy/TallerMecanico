import { PrismaClienteRepository } from "../db/prismaClienteRepository";
import { PrismaVehiculoRepository } from "../db/prismaVehiculoRepository";
import { PrismaUsuarioRepository } from "../db/prismaUsuarioRepository";
import { PrismaRolRepository } from "../db/prismaRolRepository";
import { PrismaMecanicoRepository } from "../db/prismaMecanicoRepository";
import { PrismaPiezaRepository } from "../db/prismaPiezaRepository";
import { PrismaReparacionRepository } from "../db/prismaReparacionRepository";
import { PrismaDetalleReparacionRepository } from "../db/prismaDetalleReparacionRepository";
import { PrismaFacturaRepository } from "../db/prismaFacturaRepository";


import { ClienteService } from "../../application/clienteService";
import { VehiculoService } from "../../application/vehiculoService";
import { UsuarioService } from "../../application/usuarioService";
import { RolService } from "../../application/rolService";
import { MecanicoService } from "../../application/mecanicoService";
import { PiezaService } from "../../application/piezaService";
import { ReparacionService } from "../../application/reparacionService";
import { DetalleReparacionService } from "../../application/detalleReparacionService";
import { FacturaService } from "../../application/facturaService";


const clienteRepository = new PrismaClienteRepository();
const clienteService = new ClienteService(clienteRepository);

const vehiculoRepository = new PrismaVehiculoRepository();
const vehiculoService = new VehiculoService(vehiculoRepository);

const usuarioRepository = new PrismaUsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepository);

const rolRepository = new PrismaRolRepository();
const rolService = new RolService(rolRepository);

const mecanicoRepository = new PrismaMecanicoRepository();
const mecanicoService = new MecanicoService(mecanicoRepository);

const piezaRepository = new PrismaPiezaRepository();
const piezaService = new PiezaService(piezaRepository);

const reparacionRepository = new PrismaReparacionRepository();
const reparacionService = new ReparacionService(reparacionRepository);

const detalleReparacionRepository = new PrismaDetalleReparacionRepository();
const detalleReparacionService = new DetalleReparacionService(detalleReparacionRepository);

const facturaRepository = new PrismaFacturaRepository();
const facturaService = new FacturaService(facturaRepository);


export const container = {
  clienteService,
  vehiculoService,
  usuarioService,
  rolService,
  mecanicoService,
  piezaService,
  detalleReparacionService,
  facturaService,
};
