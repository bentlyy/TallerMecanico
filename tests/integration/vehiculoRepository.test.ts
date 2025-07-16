import { PrismaClient } from '@prisma/client';
import { PrismaVehiculoRepository } from '../../src/infrastructure/db/prismaVehiculoRepository';

const prisma = new PrismaClient();
const repo = new PrismaVehiculoRepository(prisma);

beforeAll(async () => {
  // Opcional: limpiar o preparar base de datos para test
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('PrismaVehiculoRepository', () => {
  it('debe listar vehículos', async () => {
    const vehiculos = await repo.findAll();
    expect(Array.isArray(vehiculos)).toBe(true);
  });
});
