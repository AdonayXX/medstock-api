# MedStock API
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

API de inventario y lotes para medicamentos construida con NestJS, TypeORM y PostgreSQL.

## Requisitos
- Node.js 18+ y npm
- PostgreSQL

## Configuración rápida
1. Instala dependencias:
   ```bash
   npm install
   ```
2. Crea un archivo `.env` en la raíz con las variables requeridas:
   ```env
   PORT=3000
   JWT_SECRET=super-secret
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=medstock
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   # Activa sincronización solo en local. En prod debe ser false.
   DB_SYNC=true
   ```
3. Levanta la app:
   ```bash
   npm run start:dev
   ```

## Scripts útiles
- `npm run start` / `start:dev` / `start:prod`: ejecutar la API.
- `npm run test` / `test:cov` / `test:e2e`: pruebas unitarias, cobertura y e2e.
- `npm run lint`: linting con ESLint + Prettier.

## Notas de arquitectura
- Autenticación JWT con Passport; usa `Authorization: Bearer <token>`.
- Rutas protegidas aceptan roles mediante el decorador `@Auth(ValidRoles.admin, ...)`.
- Se usa `ValidationPipe` global con transformación de tipos (`transform: true`).
- TypeORM carga entidades automáticamente; `synchronize` se controla con `DB_SYNC` y se desactiva en `NODE_ENV=production`.

## Endpoints principales
- `POST /api/auth/register` – registro.
- `POST /api/auth/login` – login, devuelve token.
- `POST /api/products`, `PATCH /api/products/:id`, `DELETE /api/products/:id` – CRUD productos (delete requiere rol admin).
- `POST /api/batches` – crear lote (requiere auth).
- `PATCH /api/inventory/consume` – consumir stock FEFO (requiere auth).

## Despliegue
- Desactiva `DB_SYNC` en producción y usa migraciones si las agregas.
- Asegura `JWT_SECRET` y credenciales de BD vía variables de entorno.
