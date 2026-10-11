import app from '../../src/app';
import request from 'supertest';

describe('SSO del Core', () => {
  it('GET /api/auth/login redirige al authorize del Core', async () => {
    const res = await request(app).get('/api/auth/login').redirects(0);
    expect(res.status).toBe(302);
    expect(res.headers.location).toContain('/api/sso/authorize');
    expect(res.headers.location).toContain('client_id=taller');
  });

  it('GET /api/auth/me sin sesión devuelve 401 con loginUrl', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'sin-sesion');
    expect(res.body.loginUrl).toContain('/api/sso/authorize');
  });

  it('GET /api/auth/inicio sin sesión devuelve 401', async () => {
    const res = await request(app).get('/api/auth/inicio');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});
