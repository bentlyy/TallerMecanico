import { PrismaClient } from '@prisma/client';

// 1. Definimos el tipo para el error
type PrismaError = Error & {
  code?: string;
  meta?: Record<string, unknown>;
};

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: [
      { level: 'warn', emit: 'event' },
      { level: 'error', emit: 'event' }
    ]
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

// 2. Manejador de errores con tipado explícito
prisma.$on('error' as never, (e: { message: string }) => {
  console.error('Prisma error:', e.message);
});

// 3. Conexión con manejo de errores tipado
prisma.$connect()
  .then(() => console.log('✅ Connected to database'))
  .catch((err: PrismaError) => { // Tipado explícito aquí
    console.error('❌ Connection error:', err.message);
    if (err.code) console.error('Error code:', err.code);
  });

// 4. Desconexión limpia
process.on('beforeExit', async () => {
  await prisma.$disconnect()
    .catch((err: PrismaError) => { // Tipado explícito
      console.error('Disconnection error:', err.message);
    });
});

export default prisma;

// Solo mantener una instancia en desarrollo
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}