# CodiKids App

Plataforma web de CodiKids para estudiantes, familias y administración. Incluye landing pública, autenticación con Supabase, laboratorio del estudiante, seguimiento de misiones, inventos de Scratch, certificados, vista de progreso para familias y módulos de Nivel 3.

## Stack

- React 19 + Vite 8
- React Router
- Supabase Auth + Postgres
- Vercel Functions
- Vercel

## Desarrollo local

1. Instala dependencias con `npm ci`.
2. Copia `.env.example` a `.env.local`.
3. Configura las variables de cliente de Supabase.
4. Ejecuta `npm run dev`.

Las claves `SUPABASE_SERVICE_KEY` y `ANTHROPIC_API_KEY` son exclusivamente de servidor y nunca deben llevar el prefijo `VITE_`.

## Variables de entorno

Consulta `.env.example`. En producción configura las variables desde Vercel. `ADMIN_EMAIL` y `VITE_ADMIN_EMAIL` deben representar la misma cuenta administrativa.

## Calidad

- `npm run lint`
- `npm run build`

Las rutas principales se cargan de forma diferida para reducir el JavaScript inicial. Las funciones administrativas validan el token de Supabase en servidor antes de usar privilegios de service-role.

## Despliegue

El proyecto está preparado para Vercel. `vercel.json` mantiene el fallback de SPA y añade cabeceras HTTP de seguridad. No publiques archivos `.env` ni claves privadas.

## Estructura

- `src/pages`: landing, acceso, laboratorio, administración y vista familiar.
- `src/components`: experiencias interactivas, avatar, insignias, certificados y Nivel 3.
- `src/lib`: cliente de Supabase.
- `api`: funciones serverless.
- `public`: recursos públicos, sitemap y robots.
- `*.sql`: esquema y extensiones de Supabase.
