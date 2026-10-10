import { PrismaClient, EstadoReparacion, TipoUbicacion } from '@prisma/client';
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

async function upsertServicio(
  empresaId: number,
  data: {
    nombre: string;
    descripcion: string;
    problemaReportado: string;
    diagnostico: string;
    trabajosRealizados: string;
    precioBase: number;
  },
) {
  const existing = await prisma.servicio.findFirst({ where: { nombre: data.nombre, empresaId } });
  if (existing) return prisma.servicio.update({ where: { id: existing.id }, data });
  return prisma.servicio.create({ data: { ...data, empresaId } });
}

async function upsertUbicacion(empresaId: number, nombre: string, tipo: TipoUbicacion, orden: number) {
  const existing = await prisma.ubicacion.findUnique({ where: { nombre_empresaId: { nombre, empresaId } } });
  if (existing) return existing;
  return prisma.ubicacion.create({ data: { nombre, tipo, orden, empresaId } });
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
    update: { nombre: 'Juan Pérez', rut: '12.345.678-9', telefono: '555-1234', direccion: 'Av. Siempre Viva 123' },
    create: {
      nombre: 'Juan Pérez',
      rut: '12.345.678-9',
      email: 'juan@email.com',
      telefono: '555-1234',
      direccion: 'Av. Siempre Viva 123',
      empresaId: empresa.id,
    },
  });

  await prisma.cliente.upsert({
    where: { email_empresaId: { email: 'maria@email.com', empresaId: empresa.id } },
    update: { nombre: 'María García', rut: '9.876.543-2', telefono: '555-5678', direccion: 'Calle Falsa 456' },
    create: {
      nombre: 'María García',
      rut: '9.876.543-2',
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

  const serviciosData = [
    {
      nombre: 'Cambio de aceite y filtros',
      descripcion: 'Cambio de aceite y filtros',
      problemaReportado: 'El cliente solicita el cambio de aceite y filtros.',
      diagnostico: 'Se verifica el nivel y estado del aceite; se recomienda el cambio según el kilometraje.',
      trabajosRealizados:
        'Cambio de aceite de motor, filtro de aceite, filtro de aire y filtro de combustible. Control de niveles y revisión de pérdidas.',
      precioBase: 15000,
    },
    {
      nombre: 'Service / mantenimiento',
      descripcion: 'Service de mantenimiento preventivo',
      problemaReportado: 'Mantenimiento periódico por kilometraje.',
      diagnostico: 'Inspección general según el plan de mantenimiento del fabricante.',
      trabajosRealizados:
        'Cambio de aceite y filtros, control de niveles, revisión de frenos, suspensión, luces, correas y estado general.',
      precioBase: 45000,
    },
    {
      nombre: 'Frenos',
      descripcion: 'Revisión y service de frenos',
      problemaReportado: 'Ruidos o pérdida de eficacia al frenar.',
      diagnostico: 'Desgaste de pastillas y/o discos; se verifica el nivel de líquido de frenos.',
      trabajosRealizados: 'Cambio de pastillas de freno, rectificado/cambio de discos y purgado del líquido de frenos.',
      precioBase: 30000,
    },
    {
      nombre: 'Alineación y balanceo',
      descripcion: 'Alineación y balanceo',
      problemaReportado: 'El vehículo se desvía o vibra el volante.',
      diagnostico: 'Desalineación de la dirección y desbalanceo de ruedas.',
      trabajosRealizados: 'Alineación de dirección, balanceo de las 4 ruedas y control de presión.',
      precioBase: 18000,
    },
    {
      nombre: 'Batería / eléctrico',
      descripcion: 'Diagnóstico eléctrico / batería',
      problemaReportado: 'Dificultad para arrancar o fallas eléctricas.',
      diagnostico: 'Batería con bajo voltaje y/o fallas en alternador o masa.',
      trabajosRealizados: 'Prueba de batería y alternador, limpieza de bornes, revisión de fusibles y luces.',
      precioBase: 12000,
    },
    {
      nombre: 'Neumáticos',
      descripcion: 'Service de neumáticos',
      problemaReportado: 'Desgaste irregular o pinchazo.',
      diagnostico: 'Se verifica el estado y desgaste de las cubiertas.',
      trabajosRealizados: 'Reparación/cambio de neumáticos, rotación y control de presión.',
      precioBase: 10000,
    },
    {
      nombre: 'Aire acondicionado',
      descripcion: 'Service de aire acondicionado',
      problemaReportado: 'El aire acondicionado no enfría.',
      diagnostico: 'Baja carga de gas y posible obstrucción del circuito.',
      trabajosRealizados: 'Recarga de gas refrigerante, limpieza del circuito y control del compresor.',
      precioBase: 25000,
    },
    {
      nombre: 'Diagnóstico general',
      descripcion: 'Diagnóstico general',
      problemaReportado: 'Revisión integral a solicitud del cliente.',
      diagnostico: 'Escaneo OBD y revisión general de sistemas.',
      trabajosRealizados: 'Escaneo de computadora, prueba en ruta y revisión de sistemas principales.',
      precioBase: 20000,
    },
  ];

  for (const servicio of serviciosData) {
    await upsertServicio(empresa.id, servicio);
  }

  const ubicacionesData: { nombre: string; tipo: TipoUbicacion; orden: number }[] = [
    { nombre: 'Recepción', tipo: 'RECEPCION', orden: 1 },
    { nombre: 'Patio / estacionamiento', tipo: 'ESTACIONAMIENTO', orden: 2 },
    { nombre: 'Bahía 1', tipo: 'BAHIA', orden: 3 },
    { nombre: 'Bahía 2', tipo: 'BAHIA', orden: 4 },
    { nombre: 'Bahía 3', tipo: 'BAHIA', orden: 5 },
    { nombre: 'Elevador', tipo: 'ELEVADOR', orden: 6 },
    { nombre: 'Diagnóstico', tipo: 'DIAGNOSTICO', orden: 7 },
    { nombre: 'Alineación y balanceo', tipo: 'ALINEACION', orden: 8 },
    { nombre: 'Neumáticos', tipo: 'NEUMATICOS', orden: 9 },
    { nombre: 'Lubricación', tipo: 'LUBRICACION', orden: 10 },
    { nombre: 'Chapa y pintura', tipo: 'CHAPA_PINTURA', orden: 11 },
    { nombre: 'Lavado', tipo: 'LAVADO', orden: 12 },
    { nombre: 'Listos para entrega', tipo: 'TERMINADOS', orden: 13 },
  ];

  for (const u of ubicacionesData) {
    await upsertUbicacion(empresa.id, u.nombre, u.tipo, u.orden);
  }

  const demo = {
    descripcion: 'Service de mantenimiento preventivo (45.000 km)',
    problemaReportado:
      'El cliente reporta un ruido leve en el motor y solicita el service correspondiente a los 45.000 km.',
    diagnostico:
      'Aceite de motor degradado y filtro de aceite obstruido. Niveles de fluidos por debajo del mínimo. Frenos y suspensión sin novedades.',
    trabajosRealizados:
      'Cambio de aceite 10W40 y filtro de aceite. Control y reposición de niveles. Revisión general de 30 puntos.',
  };

  const demoReparacion = await prisma.reparacion.findFirst({ where: { vehiculoId: vehiculos[0].id } });

  if (demoReparacion) {
    await prisma.reparacion.update({ where: { id: demoReparacion.id }, data: demo });
  } else {
    const reparacion = await prisma.reparacion.create({
      data: {
        ...demo,
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
  }

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
