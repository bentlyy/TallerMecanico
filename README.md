# Taller Mecánico — Sistema de Gestión

Sistema full-stack para la gestión integral de talleres mecánicos multitenant. Backend en Node.js + TypeScript + Prisma (PostgreSQL) y frontend React con Material UI.

## Stack

| Capa          | Tecnología                                  |
| ------------- | ------------------------------------------- |
| Backend       | Node.js 20, TypeScript, Express 5, Prisma 6 |
| Frontend      | React 18, TypeScript, Vite 5, MUI 7         |
| Base de datos | PostgreSQL 15                               |
| Testing       | Jest 30, Supertest, Vitest 3                |
| Contenedores  | Docker, Docker Compose                      |
| CI/CD         | GitHub Actions                              |

## Arquitectura

```
src/
  domain/          → Entidades, interfaces de repositorio, tipos
  application/     → Servicios con lógica de negocio
  infrastructure/  → Implementación Prisma, DI, middleware, logger
  presentation/    → Controladores y rutas Express

frontend/src/
  api/             → Módulos Axios por entidad
  components/      → Componentes reutilizables
  contexts/        → AuthContext (JWT)
  pages/           → Páginas por módulo
  types/           → Definiciones TypeScript
```

## Módulos

- **Empresas** — Multitenant: cada empresa posee sus datos
- **Clientes** — Propietarios de vehículos con datos de contacto
- **Vehículos** — Marca, modelo, año, placa, kilometraje
- **Reparaciones** — Órdenes con flujo: En Revisión → En Reparación → Terminado → Entregado
- **Detalle Reparación** — Piezas utilizadas por reparación (M:N)
- **Piezas** — Inventario con código, stock y precio
- **Facturas** — Vinculadas a cliente y reparación
- **Usuarios** — Autenticación JWT, bloqueo por 5 intentos fallidos
- **Roles** — RBAC con permisos JSON
- **Mecánicos** — Extensión de usuario con especialidad

## Requisitos

- Docker & Docker Compose
- Node.js >= 20
- npm

## Inicio rápido (desarrollo)

```bash
# 1. Base de datos
docker-compose up -d

# 2. Backend
npm install
npx prisma migrate dev
npx prisma generate
npm run dev              # http://localhost:3000

# 3. Frontend
cd frontend
npm install
npm run dev              # http://localhost:5173
```

## Variables de entorno

Copiar `.env.example` a `.env` y configurar:

- `DATABASE_URL` — Conexión PostgreSQL
- `JWT_SECRET` — Secreto para tokens JWT
- `JWT_EXPIRES_IN` — Expiración de token
- `PORT` — Puerto del servidor

## Scripts principales

| Script              | Descripción                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Backend en modo desarrollo (ts-node-dev) |
| `npm run build`     | Compilar TypeScript                      |
| `npm start`         | Iniciar en producción                    |
| `npm test`          | Ejecutar pruebas                         |
| `npm run lint`      | ESLint                                   |
| `npm run typecheck` | Verificar tipos                          |

## Docker (producción)

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## API Docs

Swagger/OpenAPI disponible en `/api-docs` con el servidor corriendo.

## Monitoreo

- **Prometheus**: Métricas en `/metrics`
- **Grafana**: Dashboards preconfigurados (solo en entorno dev)
- **Health check**: Endpoint `/health`
