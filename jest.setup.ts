/**
 * Entorno de pruebas.
 *
 * `@amg/auth-client` (vía amgSso) resuelve su config al importar y es fail-fast:
 * sin CORE_URL/APP_URL/AMG_SSO_CLIENT_ID/AMG_SSO_CLIENT_SECRET revienta. Como los
 * tests importan `src/app`, definimos valores dummy antes de que se cargue.
 * dotenv no pisa variables ya definidas, así que estos valores mandan en tests.
 */
process.env.CORE_URL = process.env.CORE_URL ?? 'http://localhost:3008';
process.env.APP_URL = process.env.APP_URL ?? 'http://localhost:3000';
process.env.AMG_SSO_CLIENT_ID = process.env.AMG_SSO_CLIENT_ID ?? 'taller';
process.env.AMG_SSO_CLIENT_SECRET = process.env.AMG_SSO_CLIENT_SECRET ?? 'test-secret';
