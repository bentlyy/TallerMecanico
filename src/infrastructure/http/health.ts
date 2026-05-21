import { Router } from 'express';
import { prisma } from '../db/prisma';

export const healthRouter = Router();

healthRouter.get('/', async (_req, res) => {
  const mem = process.memoryUsage();
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'OK',
      version: '1.0.0',
      uptime: process.uptime(),
      db: 'connected',
      memory: {
        rss: Math.round(mem.rss / 1024 / 1024) + 'MB',
        heapUsed: Math.round(mem.heapUsed / 1024 / 1024) + 'MB',
        heapTotal: Math.round(mem.heapTotal / 1024 / 1024) + 'MB',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(503).json({
      status: 'DOWN',
      version: '1.0.0',
      uptime: process.uptime(),
      db: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});
