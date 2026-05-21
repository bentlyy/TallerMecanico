import { PrismaClient, EstadoReparacion } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const empresa = await prisma.empresa.create({
    data: { nombre: 'Taller Mecánico Central', activa: true },
  });

  const roles = await Promise.all([
    prisma.rol.create({ data: { nombre: 'ADMIN', permisos: { ALL: true } } }),
    prisma.rol.create({
      data: { nombre: 'RECEPCIONISTA', permisos: { CLIENTES: true, REPARACIONES: true, FACTURAS: true, PIEZAS: true } },
    }),
    prisma.rol.create({ data: { nombre: 'MECANICO', permisos: { REPARACIONES: true, PIEZAS: true } } }),
  ]);

  const [adminRol, recepcionistaRol, mecanicoRol] = roles;
  const passwordHash = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.usuario.create({
    data: {
      email: 'admin@taller.com',
      passwordHash,
      nombre: 'Admin',
      activo: true,
      rolId: adminRol.id,
      empresaId: empresa.id,
    },
  });

  await prisma.usuario.create({
    data: {
      email: 'recepcion@taller.com',
      passwordHash,
      nombre: 'Recepcionista',
      activo: true,
      rolId: recepcionistaRol.id,
      empresaId: empresa.id,
    },
  });

  const mecanicoUser = await prisma.usuario.create({
    data: {
      email: 'mecanico@taller.com',
      passwordHash,
      nombre: 'Mecánico',
      activo: true,
      rolId: mecanicoRol.id,
      empresaId: empresa.id,
    },
  });

  await prisma.mecanico.create({
    data: { usuarioId: mecanicoUser.id, especialidad: 'Motor y Transmisión' },
  });

  const cliente = await prisma.cliente.create({
    data: {
      nombre: 'Juan Pérez',
      email: 'juan@email.com',
      telefono: '555-1234',
      direccion: 'Av. Siempre Viva 123',
      empresaId: empresa.id,
    },
  });

  await prisma.cliente.create({
    data: {
      nombre: 'María García',
      email: 'maria@email.com',
      telefono: '555-5678',
      direccion: 'Calle Falsa 456',
      empresaId: empresa.id,
    },
  });

  const vehiculos = await Promise.all([
    prisma.vehiculo.create({
      data: {
        marca: 'Toyota',
        modelo: 'Corolla',
        anio: 2020,
        patente: 'ABC123',
        kilometraje: 45000,
        clienteId: cliente.id,
      },
    }),
    prisma.vehiculo.create({
      data: {
        marca: 'Honda',
        modelo: 'Civic',
        anio: 2021,
        patente: 'DEF456',
        kilometraje: 32000,
        clienteId: cliente.id,
      },
    }),
    prisma.vehiculo.create({
      data: {
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
    prisma.pieza.create({
      data: {
        nombre: 'Filtro de aceite',
        marca: 'Bosch',
        precio: 2500,
        stock: 10,
        codigo: 'FIL-001',
        empresaId: empresa.id,
      },
    }),
    prisma.pieza.create({
      data: {
        nombre: 'Pastillas de freno',
        marca: 'Bosch',
        precio: 8500,
        stock: 15,
        codigo: 'FRENO-001',
        empresaId: empresa.id,
      },
    }),
    prisma.pieza.create({
      data: { nombre: 'Bujía NGK', marca: 'NGK', precio: 1200, stock: 30, codigo: 'BUJ-001', empresaId: empresa.id },
    }),
    prisma.pieza.create({
      data: {
        nombre: 'Aceite 10W40',
        marca: 'Castrol',
        precio: 4500,
        stock: 20,
        codigo: 'ACE-001',
        empresaId: empresa.id,
      },
    }),
    prisma.pieza.create({
      data: {
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
