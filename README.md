# Taller Mecánico - Sistema Completo

## Descripción
Proyecto profesional para gestionar un taller mecánico con backend Node.js + TypeScript + Prisma, y frontend React. Incluye Docker para orquestación, pruebas unitarias e integración, y pipeline CI/CD.

## Estructura del Proyecto

- `/src`: Código backend organizado en capas (domain, application, infrastructure, presentation)
- `/prisma`: ORM Prisma con esquema, migraciones y seed
- `/frontend`: Código frontend React
- `/tests`: Pruebas unitarias e integración
- `/config`: Configuraciones comunes
- `.github/workflows`: CI/CD
- `docker-compose.yml`: Contenedores para DB, backend y frontend

## Requisitos

- Docker & Docker Compose
- Node.js >=16
- npm/yarn

## Configuración

1. Copiar `.env.example` a `.env` y configurar variables (DB, JWT, etc.)
2. Levantar contenedores:
   ```bash
   docker-compose up -d
