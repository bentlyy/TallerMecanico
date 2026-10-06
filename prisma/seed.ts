import { PrismaClient, EstadoReparacion } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function upsertEmpresa(nombre: string) {
  const existing = await prisma.empresa.findFirst({ where: { nombre } });
  if (existing) return existing;
  return prisma.empresa.create({ data: { nombre, activa: true } });
}

async function upsertRol(nombre: string, permisos: object) {
  const existing = await prisma.rol.findFirst({ where: { nombre } });
  if (existing) return existing;
  return prisma.rol.create({ data: { nombre, permisos } });
}

async function main() {
  const empresa = await upsertEmpresa('Taller Mecánico Central');

  const roles = await Promise.all([
    upsertRol('ADMIN', { ALL: true }),
    upsertRol('RECEPCIONISTA', { CLIENTES: true, REPARACIONES: true, FACTURAS: true, PIEZAS: true }),
    upsertRol('MECANICO', { REPARACIONES: true, PIEZAS: true }),
  ]);

  const [adminRol, recepcionistaRol, mecanicoRol] = roles;
  const passwordHash = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.usuario.upsert({
    where: { email_empresaId: { email: 'admin@taller.com', empresaId: empresa.id } },
    update: { passwordHash, nombre: 'Admin', activo: true, rolId: adminRol.id },
    create: {
      email: 'admin@taller.com',
      passwordHash,
      nombre: 'Admin',
      activo: true,
      rolId: adminRol.id,
      empresaId: empresa.id,
    },
  });

  await prisma.usuario.upsert({
    where: { email_empresaId: { email: 'recepcion@taller.com', empresaId: empresa.id } },
    update: { passwordHash, nombre: 'Recepcionista', activo: true, rolId: recepcionistaRol.id },
    create: {
      email: 'recepcion@taller.com',
      passwordHash,
      nombre: 'Recepcionista',
      activo: true,
      rolId: recepcionistaRol.id,
      empresaId: empresa.id,
    },
  });

  const mecanicoUser = await prisma.usuario.upsert({
    where: { email_empresaId: { email: 'mecanico@taller.com', empresaId: empresa.id } },
    update: { passwordHash, nombre: 'Mecánico', activo: true, rolId: mecanicoRol.id },
    create: {
      email: 'mecanico@taller.com',
      passwordHash,
      nombre: 'Mecánico',
      activo: true,
      rolId: mecanicoRol.id,
      empresaId: empresa.id,
    },
  });

  const existingMecanico = await prisma.mecanico.findFirst({ where: { usuarioId: mecanicoUser.id } });
  if (!existingMecanico) {
    await prisma.mecanico.create({ data: { usuarioId: mecanicoUser.id, especialidad: 'Motor y Transmisión' } });
  }

  const cliente = await prisma.cliente.upsert({
    where: { email_empresaId: { email: 'juan@email.com', empresaId: empresa.id } },
    update: { nombre: 'Juan Pérez', telefono: '555-1234', direccion: 'Av. Siempre Viva 123' },
    create: {
      nombre: 'Juan Pérez',
      email: 'juan@email.com',
      telefono: '555-1234',
      direccion: 'Av. Siempre Viva 123',
      empresaId: empresa.id,
    },
  });

  await prisma.cliente.upsert({
    where: { email_empresaId: { email: 'maria@email.com', empresaId: empresa.id } },
    update: { nombre: 'María García', telefono: '555-5678', direccion: 'Calle Falsa 456' },
    create: {
      nombre: 'María García',
      email: 'maria@email.com',
      telefono: '555-5678',
      direccion: 'Calle Falsa 456',
      empresaId: empresa.id,
    },
  });

  const vehiculos = await Promise.all([
    prisma.vehiculo.upsert({
      where: { patente_clienteId: { patente: 'ABC123', clienteId: cliente.id } },
      update: { marca: 'Toyota', modelo: 'Corolla', anio: 2020, kilometraje: 45000 },
      create: {
        marca: 'Toyota',
        modelo: 'Corolla',
        anio: 2020,
        patente: 'ABC123',
        kilometraje: 45000,
        clienteId: cliente.id,
      },
    }),
    prisma.vehiculo.upsert({
      where: { patente_clienteId: { patente: 'DEF456', clienteId: cliente.id } },
      update: { marca: 'Honda', modelo: 'Civic', anio: 2021, kilometraje: 32000 },
      create: {
        marca: 'Honda',
        modelo: 'Civic',
        anio: 2021,
        patente: 'DEF456',
        kilometraje: 32000,
        clienteId: cliente.id,
      },
    }),
    prisma.vehiculo.upsert({
      where: { patente_clienteId: { patente: 'GHI789', clienteId: cliente.id } },
      update: { marca: 'Ford', modelo: 'Fiesta', anio: 2019, kilometraje: 58000 },
      create: {
        marca: 'Ford',
        modelo: 'Fiesta',
        anio: 2019,
        patente: 'GHI789',
        kilometraje: 58000,
        clienteId: cliente.id,
      },
    }),
  ]);

  const piezas = await Promise.all([
    prisma.pieza.upsert({
      where: { codigo_empresaId: { codigo: 'FIL-001', empresaId: empresa.id } },
      update: { nombre: 'Filtro de aceite', marca: 'Bosch', precio: 2500, stock: 10 },
      create: {
        nombre: 'Filtro de aceite',
        marca: 'Bosch',
        precio: 2500,
        stock: 10,
        codigo: 'FIL-001',
        empresaId: empresa.id,
      },
    }),
    prisma.pieza.upsert({
      where: { codigo_empresaId: { codigo: 'FRENO-001', empresaId: empresa.id } },
      update: { nombre: 'Pastillas de freno', marca: 'Bosch', precio: 8500, stock: 15 },
      create: {
        nombre: 'Pastillas de freno',
        marca: 'Bosch',
        precio: 8500,
        stock: 15,
        codigo: 'FRENO-001',
        empresaId: empresa.id,
      },
    }),
    prisma.pieza.upsert({
      where: { codigo_empresaId: { codigo: 'BUJ-001', empresaId: empresa.id } },
      update: { nombre: 'Bujía NGK', marca: 'NGK', precio: 1200, stock: 30 },
      create: { nombre: 'Bujía NGK', marca: 'NGK', precio: 1200, stock: 30, codigo: 'BUJ-001', empresaId: empresa.id },
    }),
    prisma.pieza.upsert({
      where: { codigo_empresaId: { codigo: 'ACE-001', empresaId: empresa.id } },
      update: { nombre: 'Aceite 10W40', marca: 'Castrol', precio: 4500, stock: 20 },
      create: {
        nombre: 'Aceite 10W40',
        marca: 'Castrol',
        precio: 4500,
        stock: 20,
        codigo: 'ACE-001',
        empresaId: empresa.id,
      },
    }),
    prisma.pieza.upsert({
      where: { codigo_empresaId: { codigo: 'COR-001', empresaId: empresa.id } },
      update: { nombre: 'Correa de distribución', marca: 'Gates', precio: 15000, stock: 5 },
      create: {
        nombre: 'Correa de distribución',
        marca: 'Gates',
        precio: 15000,
        stock: 5,
        codigo: 'COR-001',
        empresaId: empresa.id,
      },
    }),
  ]);

  const reparacion = await prisma.reparacion.create({
    data: {
      descripcion: 'Cambio de aceite y filtro + revisión general',
      vehiculoId: vehiculos[0].id,
      recepcionistaId: adminUser.id,
      mecanicoId: (await prisma.mecanico.findFirst())!.id,
      estado: EstadoReparacion.TERMINADO,
      costoManoObra: 8000,
    },
  });

  await prisma.detalleReparacion.create({
    data: { reparacionId: reparacion.id, piezaId: piezas[0].id, cantidad: 1, precioUnitario: 2500 },
  });
  await prisma.detalleReparacion.create({
    data: { reparacionId: reparacion.id, piezaId: piezas[3].id, cantidad: 1, precioUnitario: 4500 },
  });

  await prisma.factura.create({
    data: { total: 15000, clienteId: cliente.id, reparacionId: reparacion.id },
  });

  console.log('Seed completado exitosamente con datos realistas');
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
