# TallerPro — Sistema de Gestión para Talleres Mecánicos

Sistema full-stack **multi-tenant** para la gestión integral de talleres mecánicos. Permite administrar clientes, vehículos, órdenes de reparación, inventario de piezas, mecánicos, facturación, usuarios y roles con autenticación y autorización RBAC.

## Stack Tecnológico

| Capa                  | Tecnología                                            |
| --------------------- | ----------------------------------------------------- |
| **Backend**           | Node.js 20, TypeScript 5.8, Express 5, Prisma 6       |
| **Frontend**          | React 18, TypeScript, Vite 5, Material UI 7           |
| **Base de datos**     | PostgreSQL 15                                         |
| **Autenticación**     | JWT + bcrypt + bloqueo por intentos fallidos          |
| **Validación**        | Joi (backend), react-hook-form (frontend)             |
| **Testing**           | Jest 30 + Supertest (backend), Vitest 3 (frontend)    |
| **Logging**           | Pino (JSON estructurado)                              |
| **Monitoreo**         | Prometheus + Grafana                                  |
| **Documentación API** | Swagger / OpenAPI 3                                   |
| **Contenedores**      | Docker multi-stage + Docker Compose                   |
| **CI/CD**             | GitHub Actions (lint, typecheck, test, build, docker) |
| **Calidad**           | ESLint, Prettier, Husky + lint-staged                 |

## Arquitectura

Arquitectura limpia (**Clean Architecture / Hexagonal**) con separación clara de responsabilidades:

```
src/
├── domain/           → Entidades, interfaces de repositorio, tipos
├── application/      → Servicios con lógica de negocio (casos de uso)
├── infrastructure/   → Implementación Prisma, DI container, middleware HTTP, logger
└── presentation/     → Controladores y rutas Express

frontend/src/
├── api/              → Módulos Axios por entidad (con interceptor JWT)
├── components/       → Componentes CRUD (Form + List) por módulo
├── contexts/         → AuthContext (manejo de JWT y sesión)
├── pages/            → Páginas por módulo
└── types/            → Interfaces TypeScript
```

## Modelo de Datos

El esquema consta de **10 tablas** con aislamiento multi-tenant via `empresa_id`:

```
empresas
├── clientes ──── vehiculos
│                     └── reparaciones ──── detalle_reparacion ──── piezas
│                                          └── facturas
├── usuarios ──── roles
│     └── mecanicos
└── piezas
```

| Entidad               | Relaciones clave                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Empresa**           | Raíz multitenant; cada empresa posee sus datos de forma aislada                                                     |
| **Cliente**           | Tiene `Vehiculo[]` y `Factura[]`; email único por empresa                                                           |
| **Vehículo**          | Pertenece a un `Cliente`; patente única por empresa; tiene `Reparacion[]`                                           |
| **Reparación**        | Flujo de estados: `EN_REVISION → EN_REPARACION → TERMINADO → ENTREGADO`. Vincula vehículo, mecánico y recepcionista |
| **DetalleReparación** | M:N entre reparaciones y piezas con cantidad y precio unitario                                                      |
| **Pieza**             | Inventario con código, stock y precio; código único por empresa                                                     |
| **Factura**           | Vinculada a `Cliente` y `Reparacion`; total calculado                                                               |
| **Usuario**           | Autenticación JWT + bcrypt; bloqueo tras 5 intentos fallidos (15 min); email único por empresa                      |
| **Rol**               | RBAC con permisos en JSON (ADMIN, RECEPCIONISTA, MECANICO)                                                          |
| **Mecánico**          | Extensión 1:1 de `Usuario` con especialidad                                                                         |

## Funcionalidades

### Multi-tenancy

- Aislamiento completo de datos por empresa (`empresa_id` en todas las consultas)
- Cada empresa tiene sus propios clientes, vehículos, piezas, usuarios y reparaciones

### Autenticación y Autorización

- **JWT** con expiración configurable y refresh implícito
- **Bcrypt** para hash de contraseñas
- **RBAC** con 3 roles predefinidos: `ADMIN`, `RECEPCIONISTA`, `MECANICO`
- Permisos flexibles basados en JSONB
- Bloqueo automático tras 5 intentos fallidos de inicio de sesión (15 min de enfriamiento)
- Middleware `requireRol()` para protección de rutas

### Gestión de Reparaciones

- Flujo de estados con validación de transiciones
- Asignación de mecánicos a órdenes
- Control de inventario: descuento/restauración automática de stock al agregar/remover piezas
- Historial completo por vehículo, mecánico y recepcionista

### Inventario

- Control de stock con código único por empresa
- Alertas visuales de stock bajo en el dashboard
- Descuento automático al usar piezas en reparaciones

### Facturación

- Facturas vinculadas a cliente y reparación
- Cálculo de total: costo de mano de obra + suma de piezas utilizadas

### Dashboard

- Tarjetas con estadísticas: clientes, vehículos, reparaciones por estado, mecánicos activos, piezas con stock bajo
- Acceso rápido a todas las secciones de gestión

### Monitoreo y Observabilidad

- **Health check**: `GET /health` (ping a BD + uso de memoria)
- **Métricas Prometheus**: `GET /metrics` (request count, duration, errors)
- **Grafana**: Dashboards preconfigurados para visualización de métricas
- **Logging estructurado**: Pino con formato JSON y serialización de requests

### API Documentation

- Swagger UI interactivo en `GET /api-docs`
- OpenAPI 3 generado automáticamente desde JSDoc

### Seguridad

- **Helmet** (CSP, XSS, clickjacking, etc.)
- **CORS** configurable
- **Rate limiting**: 200 requests por 15 minutos por IP
- **Validación** de entrada con Joi (body, params, query)
- **Graceful shutdown**: Manejo de SIGTERM/SIGINT con cierre ordenado de conexiones

## Inicio Rápido (Desarrollo Local)

### Requisitos

- Docker & Docker Compose
- Node.js >= 20
- npm

### Paso a paso

```bash
# 1. Clonar e instalar backend
git clone <repo>
cd taller-mecanico
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env según sea necesario (JWT_SECRET, etc.)

# 3. Iniciar base de datos
docker-compose up -d

# 4. Ejecutar migraciones y generar cliente Prisma
npx prisma migrate dev
npx prisma generate

# 5. (Opcional) Seed de datos de demostración
npm run prisma:seed

# 6. Iniciar backend
npm run dev                 # http://localhost:3000

# 7. En otra terminal, iniciar frontend
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

### Desarrollo con Docker Compose (todo incluido)

```bash
docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d
```

| Servicio    | URL                   |
| ----------- | --------------------- |
| Backend API | http://localhost:3000 |
| Frontend    | http://localhost:3043 |
| Grafana     | http://localhost:3001 |
| Prometheus  | http://localhost:9090 |

### Producción

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Credenciales de Prueba (post seed)

| Rol               | Email                | Contraseña |
| ----------------- | -------------------- | ---------- |
| **Admin**         | admin@taller.com     | admin123   |
| **Recepcionista** | recepcion@taller.com | admin123   |
| **Mecánico**      | mecanico@taller.com  | admin123   |

## Variables de Entorno

| Variable         | Descripción                                  | Valor por defecto       |
| ---------------- | -------------------------------------------- | ----------------------- |
| `DATABASE_URL`   | Conexión PostgreSQL                          | `postgresql://...`      |
| `JWT_SECRET`     | Secreto para tokens JWT (mín. 16 caracteres) | —                       |
| `JWT_EXPIRES_IN` | Expiración del token                         | `8h`                    |
| `PORT`           | Puerto del servidor                          | `3000`                  |
| `NODE_ENV`       | Entorno de ejecución                         | `development`           |
| `CORS_ORIGIN`    | Origen permitido para CORS                   | `http://localhost:3043` |
| `LOG_LEVEL`      | Nivel de logging (debug, info, warn, error)  | `info`                  |
| `API_VERSION`    | Versión de la API                            | `v1`                    |

## Scripts (Backend)

| Script                  | Descripción                                       |
| ----------------------- | ------------------------------------------------- |
| `npm run dev`           | Iniciar backend en modo desarrollo con hot-reload |
| `npm run build`         | Compilar TypeScript a JavaScript                  |
| `npm start`             | Iniciar en producción desde `dist/`               |
| `npm test`              | Ejecutar todas las pruebas                        |
| `npm run test:watch`    | Pruebas en modo watch                             |
| `npm run test:coverage` | Pruebas con reporte de cobertura                  |
| `npm run lint`          | Ejecutar ESLint                                   |
| `npm run lint:fix`      | ESLint con corrección automática                  |
| `npm run typecheck`     | Verificar tipos TypeScript (strict mode)          |
| `npm run prisma:seed`   | Poblar BD con datos de demostración               |
| `npm run format`        | Formatear código con Prettier                     |

## API REST

Todas las rutas están prefijadas con `/api/v1` y protegidas con autenticación JWT (excepto `/auth/login` y `/health`).

### Autenticación

| Método | Ruta                    | Descripción                  |
| ------ | ----------------------- | ---------------------------- |
| `POST` | `/api/v1/auth/login`    | Iniciar sesión (retorna JWT) |
| `POST` | `/api/v1/auth/register` | Registrar nuevo usuario      |

### Módulos CRUD

| Módulo                | Rutas (`/api/v1/`)                                                                                                                                        | Middleware                                   |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| **Clientes**          | `GET /clientes`, `GET /clientes/:id`, `POST /clientes`, `PUT /clientes/:id`, `DELETE /clientes/:id`                                                       | `requireRol(ADMIN, RECEPCIONISTA)`           |
| **Vehículos**         | `GET /vehiculos`, `GET /vehiculos/:id`, `POST /vehiculos`, `PUT /vehiculos/:id`, `DELETE /vehiculos/:id`                                                  | `requireRol(ADMIN, RECEPCIONISTA)`           |
| **Reparaciones**      | `GET /reparaciones`, `GET /reparaciones/:id`, `POST /reparaciones`, `PUT /reparaciones/:id`, `DELETE /reparaciones/:id`, `PATCH /reparaciones/:id/estado` | `requireRol(ADMIN, RECEPCIONISTA, MECANICO)` |
| **DetalleReparación** | `GET /reparaciones/:id/detalles`, `POST /reparaciones/:id/detalles`, `PUT /detalles/:id`, `DELETE /detalles/:id`                                          | `requireRol(ADMIN, RECEPCIONISTA)`           |
| **Piezas**            | `GET /piezas`, `GET /piezas/:id`, `POST /piezas`, `PUT /piezas/:id`, `DELETE /piezas/:id`                                                                 | CRUD: ADMIN, RECEPCIONISTA; GET: todos       |
| **Facturas**          | `GET /facturas`, `GET /facturas/:id`, `POST /facturas`                                                                                                    | `requireRol(ADMIN, RECEPCIONISTA)`           |
| **Usuarios**          | `GET /usuarios`, `GET /usuarios/:id`, `POST /usuarios`, `PUT /usuarios/:id`, `DELETE /usuarios/:id`                                                       | `requireRol(ADMIN)`                          |
| **Roles**             | `GET /roles`, `GET /roles/:id`, `POST /roles`, `PUT /roles/:id`, `DELETE /roles/:id`                                                                      | `requireRol(ADMIN)`                          |
| **Mecánicos**         | `GET /mecanicos`, `GET /mecanicos/:id`, `POST /mecanicos`, `PUT /mecanicos/:id`, `DELETE /mecanicos/:id`                                                  | `requireRol(ADMIN)`                          |

### Utilidades

| Método | Ruta        | Descripción                    |
| ------ | ----------- | ------------------------------ |
| `GET`  | `/health`   | Health check (BD, memoria)     |
| `GET`  | `/metrics`  | Métricas Prometheus            |
| `GET`  | `/api-docs` | Swagger UI (sin autenticación) |

## Endpoints Destacados

- `GET /api/v1/clientes/:id/vehiculos` — Vehículos de un cliente
- `GET /api/v1/clientes/:id/facturas` — Facturas de un cliente
- `GET /api/v1/vehiculos/:id/reparaciones` — Historial de reparaciones de un vehículo
- `PATCH /api/v1/reparaciones/:id/estado` — Cambiar estado de una reparación
- `POST /api/v1/reparaciones/:id/mecanico` — Asignar mecánico a una reparación
- `POST /api/v1/reparaciones/:id/salida` — Registrar salida (fecha + estado)
- `POST /api/v1/reparaciones/:id/detalles` — Agregar pieza a una reparación (descuenta stock)
- `DELETE /api/v1/detalles/:id` — Remover pieza de una reparación (restaura stock)

## Pruebas

### Backend (Jest + Supertest)

```bash
npm test                    # Todas las pruebas
npm run test:watch          # Modo watch
npm run test:coverage       # Con cobertura
```

### Frontend (Vitest)

```bash
cd frontend
npm test
```

## Docker

### Desarrollo

```bash
docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d
```

### Producción

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Scripts de Base de Datos

```bash
# Backup
./scripts/backup-db.sh

# Restore
./scripts/restore-db.sh
```

## Monitoreo

| Herramienta    | URL                   | Descripción                    |
| -------------- | --------------------- | ------------------------------ |
| **Prometheus** | http://localhost:9090 | Recopilación de métricas       |
| **Grafana**    | http://localhost:3001 | Dashboards preconfigurados     |
| **Health**     | `GET /health`         | Estado del servidor y BD       |
| **Métricas**   | `GET /metrics`        | Métricas en formato Prometheus |

## CI/CD (GitHub Actions)

Pipeline automatizado en cada push y PR a `main`:

1. **Lint** — ESLint + Prettier check
2. **TypeScript type check** — `tsc --noEmit`
3. **Build** — Compilación de TypeScript + generación de Prisma Client
4. **Tests** — Pruebas unitarias e integración con PostgreSQL como servicio
5. **Docker build** — Construcción de imagen multi-stage

## Estructura del Proyecto

```
taller-mecanico/
├── src/                    # Backend (TypeScript)
│   ├── domain/             #   Entidades y contratos
│   ├── application/        #   Servicios (casos de uso)
│   ├── infrastructure/     #   Persistencia, DI, HTTP, logger
│   └── presentation/       #   Controladores y rutas
├── frontend/               # Frontend (React + Vite + MUI)
│   └── src/
│       ├── api/            #   Módulos Axios
│       ├── components/     #   Componentes CRUD
│       ├── contexts/       #   AuthContext
│       ├── pages/          #   Páginas
│       └── types/          #   Interfaces TypeScript
├── prisma/                 # Schema + migraciones + seed
├── tests/                  # Pruebas (unitarias + integración)
├── monitoring/             # Configuración Prometheus + Grafana
├── scripts/                # Scripts de backup/restore
├── config/                 # Configuración de entorno
├── docker-compose.yml      # Docker Compose
├── Dockerfile              # Docker multi-stage
└── .github/workflows/      # CI/CD
```

## Licencia

MIT
