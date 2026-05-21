import { PrismaClient, EstadoReparacion } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminRol = await prisma.rol.create({
    data: {
      nombre: 'ADMIN',
      permisos: { ALL: true },
    },
  });

  const recepcionistaRol = await prisma.rol.create({
    data: {
      nombre: 'RECEPCIONISTA',
      permisos: { CLIENTES: true, REPARACIONES: true, FACTURAS: true },
    },
  });

  const mecanicoRol = await prisma.rol.create({
    data: {
      nombre: 'MECANICO',
      permisos: { REPARACIONES: true, PIEZAS: true },
    },
  });

  const passwordHash = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.usuario.create({
    data: {
      email: 'admin@taller.com',
      passwordHash,
      nombre: 'Admin',
      activo: true,
      rolId: adminRol.id,
    },
  });

  await prisma.usuario.create({
    data: {
      email: 'recepcion@taller.com',
      passwordHash,
      nombre: 'Recepcionista',
      activo: true,
      rolId: recepcionistaRol.id,
    },
  });

  const mecanicoUser = await prisma.usuario.create({
    data: {
      email: 'mecanico@taller.com',
      passwordHash,
      nombre: 'Mecanico',
      activo: true,
      rolId: mecanicoRol.id,
    },
  });

  await prisma.mecanico.create({
    data: {
      usuarioId: mecanicoUser.id,
      especialidad: 'Motor',
    },
  });

  const cliente = await prisma.cliente.create({
    data: {
      nombre: 'Juan Perez',
      email: 'juan@email.com',
      telefono: '555-1234',
    },
  });

  const vehiculo = await prisma.vehiculo.create({
    data: {
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: 2020,
      patente: 'ABC123',
      clienteId: cliente.id,
    },
  });

  const pieza = await prisma.pieza.create({
    data: {
      nombre: 'Filtro de aceite',
      precio: 2500,
      stock: 10,
      codigo: 'FIL-001',
    },
  });

  const reparacion = await prisma.reparacion.create({
    data: {
      descripcion: 'Cambio de aceite y filtro',
      vehiculoId: vehiculo.id,
      recepcionistaId: adminUser.id,
      estado: EstadoReparacion.TERMINADO,
      costoManoObra: 5000,
    },
  });

  await prisma.detalleReparacion.create({
    data: {
      reparacionId: reparacion.id,
      piezaId: pieza.id,
      cantidad: 1,
      precioUnitario: 2500,
    },
  });

  await prisma.factura.create({
    data: {
      total: 7500,
      clienteId: cliente.id,
      reparacionId: reparacion.id,
    },
  });

  console.log('Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
