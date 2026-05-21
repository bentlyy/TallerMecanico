import app from './app';
import config from '../config/env';
import logger from './infrastructure/logger/logger';
import { createHttpTerminator } from 'http-terminator';
import { prisma } from './infrastructure/db/prisma';

const server = app.listen(config.port, '0.0.0.0', () => {
  logger.info({ port: config.port, env: config.nodeEnv }, 'Servidor iniciado');
});

const httpTerminator = createHttpTerminator({ server });

async function gracefulShutdown(signal: string) {
  logger.info({ signal }, 'Señal recibida, cerrando servidor gracefulmente...');

  try {
    await httpTerminator.terminate();
    logger.info('HTTP server cerrado');

    await prisma.$disconnect();
    logger.info('Conexión a BD cerrada');

    process.exit(0);
  } catch (err) {
    logger.error({ err }, 'Error durante shutdown graceful');
    process.exit(1);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled Rejection');
});

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught Exception');
  process.exit(1);
});
