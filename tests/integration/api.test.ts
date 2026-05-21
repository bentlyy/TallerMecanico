import app from '../../src/app';
import request from 'supertest';

describe('Health endpoint', () => {
  it('GET /health debe retornar 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
    expect(res.body).toHaveProperty('version');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('db');
  });
});

describe('API root', () => {
  it('GET / debe retornar mensaje', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('version');
  });
});

describe('Swagger docs', () => {
  it('GET /api-docs debe retornar HTML', async () => {
    const res = await request(app).get('/api-docs/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('swagger');
  });

  it('GET /api-docs.json debe retornar spec', async () => {
    const res = await request(app).get('/api-docs.json');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('openapi', '3.0.0');
  });
});
