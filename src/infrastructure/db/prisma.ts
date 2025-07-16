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

const prismaInstance = globalThis.prisma ?? prismaClientSingleton();

// 2. Manejador de errores con tipado explícito
prismaInstance.$on('error' as never, (e: { message: string }) => {
  console.error('Prisma error:', e.message);
});

// 3. Conexión con manejo de errores tipado
prismaInstance.$connect()
  .then(() => console.log('✅ Connected to database'))
  .catch((err: PrismaError) => {
    console.error('❌ Connection error:', err.message);
    if (err.code) console.error('Error code:', err.code);
  });

// 4. Desconexión limpia
process.on('beforeExit', async () => {
  await prismaInstance.$disconnect()
    .catch((err: PrismaError) => {
      console.error('Disconnection error:', err.message);
    });
});

// ✅ Export nombrado
export const prisma = prismaInstance;

// Solo mantener una instancia en desarrollo
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prismaInstance;
}
