import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import express, { Express } from 'express';

export function configureSecurity(app: Express): void {
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:'],
          connectSrc: ["'self'"],
        },
      },
    }),
  );

  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3043';
  const origins = corsOrigin.split(',').map((s) => s.trim());

  if (process.env.NODE_ENV === 'production' && origins.length === 1 && origins[0] === '*') {
    throw new Error('CORS_ORIGIN no puede ser "*" en producción');
  }

  app.use(
    cors({
      origin: origins,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.' },
    }),
  );
}
