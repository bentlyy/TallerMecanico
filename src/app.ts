import pinoHttp from 'pino-http';
import { randomUUID } from 'crypto';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import express from 'express';
import * as client from 'prom-client';
import { configureSecurity } from './infrastructure/http/securityMiddleware';
import { authMiddleware } from './infrastructure/http/authMiddleware';
import { healthRouter } from './infrastructure/http/health';
import { errorHandler } from './infrastructure/http/errorHandler';
import logger from './infrastructure/logger/logger';
import config from '../config/env';
import clienteRoutes from './presentation/routes/clienteRoutes';
import vehiculoRoutes from './presentation/routes/vehiculoRoutes';
import rolRoutes from './presentation/routes/rolRoutes';
import usuarioRoutes from './presentation/routes/usuarioRoutes';
import mecanicoRoutes from './presentation/routes/mecanicoRoutes';
import piezaRoutes from './presentation/routes/piezaRoutes';
import detalleReparacionRoutes from './presentation/routes/detalleReparacionRoutes';
import facturaRoutes from './presentation/routes/facturaRoutes';
import reparacionRoutes from './presentation/routes/reparacionRoutes';
import 'reflect-metadata';

const app = express();

configureSecurity(app);

app.use(
  pinoHttp({
    logger,
    genReqId: () => randomUUID(),
    autoLogging: {
      ignore: (req) => req.url === '/health' || req.url === '/metrics',
    },
  }),
);

app.use(express.json());

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Taller Mecánico API',
      version: '1.0.0',
      description: 'API profesional para gestión de talleres mecánicos con multi-tenencia',
    },
    servers: [{ url: `/api/${config.apiVersion}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/presentation/routes/*.ts'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));

app.get('/', (req, res) => {
  res.json({ message: 'API Taller Mecanico funcionando', version: '1.0.0' });
});

app.use('/health', healthRouter);

const apiPrefix = `/api/${config.apiVersion}`;
app.use(`${apiPrefix}/clientes`, clienteRoutes);
app.use(`${apiPrefix}/vehiculos`, vehiculoRoutes);
app.use(`${apiPrefix}/roles`, rolRoutes);
app.use(`${apiPrefix}/usuarios`, usuarioRoutes);
app.use(`${apiPrefix}/mecanicos`, mecanicoRoutes);
app.use(`${apiPrefix}/piezas`, piezaRoutes);
app.use(`${apiPrefix}/reparaciones`, reparacionRoutes);
app.use(`${apiPrefix}/detalle-reparacion`, detalleReparacionRoutes);
app.use(`${apiPrefix}/facturas`, facturaRoutes);

// Legacy routes without version prefix
app.use('/api/clientes', clienteRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/roles', rolRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/mecanicos', mecanicoRoutes);
app.use('/api/piezas', piezaRoutes);
app.use('/api/reparaciones', reparacionRoutes);
app.use('/api/detalle-reparacion', detalleReparacionRoutes);
app.use('/api/facturas', facturaRoutes);

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

if (config.nodeEnv === 'production') {
  app.use('/metrics', authMiddleware, async (_req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  });
} else {
  app.get('/metrics', async (_req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  });
}

app.use(errorHandler);
export default app;
