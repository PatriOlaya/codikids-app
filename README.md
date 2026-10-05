# CODIKIDS App

Academia online y plataforma para estudiantes, familias y administración.

## Stack y estructura

React 19 + Vite 8; React Router en la aplicación privada, Supabase Auth/Postgres y Vercel Functions.
- `src/marketing/content.js`: fuente compartida de títulos, descripciones, artículos, niveles y preguntas.
- `src/marketing/PublicSite.jsx` y `marketing.css`: páginas públicas y diseño adaptable.
- `scripts/prerender.mjs`: genera HTML estático, metadatos, JSON-LD y sitemap durante el build.
- `src/main.jsx`: hidrata páginas públicas; importa la aplicación privada de forma diferida.
- `src/App.jsx`, `src/pages`, `src/components`: acceso, laboratorio, administración y seguimiento familiar.
- `api`: funciones serverless. `public`: recursos y verificación de Search Console.
- `vercel.json`: rutas públicas hacia su HTML, rutas privadas hacia app.html y cabeceras.

## Desarrollo y validación

1. `npm ci`
2. Copia `.env.example` a `.env.local` y configura Supabase.
3. `npm run dev`

Validación de producción: `npm run lint`, `npm run build`, `npm run check:seo`.
La metadata final se genera en producción; en desarrollo se usa la interfaz React.
No publiques .env. SUPABASE_SERVICE_KEY y ANTHROPIC_API_KEY son exclusivamente de servidor.

## Arquitectura SEO

Dominio único: https://codikids-app.vercel.app.
El build genera Home, dos landings, índice de blog y tres artículos con contenido completo.
Cada URL tiene título, descripción, canonical, Open Graph y Twitter Cards propios.
JSON-LD: EducationalOrganization y WebPage, BreadcrumbList en páginas interiores,
tres Course y FAQPage en el curso, BlogPosting en artículos.
El sitemap se genera a partir del registro de páginas, evitando que diverja de las rutas.
Las páginas privadas tienen noindex en app.html y X-Robots-Tag en sus rutas.
robots.txt permite rastrear las páginas privadas para que los buscadores puedan leer noindex.
Las URL desconocidas usan la página 404 de Vercel, sin redirección a Home.
Los enlaces públicos usan href reales y navegación de documento para conservar metadata por URL.
El contenido público no espera Supabase ni carga el laboratorio.
Assets con hash tienen caché immutable. Fuentes del sistema evitan peticiones de fuentes externas.
El hero usa HTML/CSS y no requiere una imagen pesada para mostrar su contenido.

## Validaciones y límites

Build y comprobaciones SEO locales pasan: siete páginas, H1 único, canonical, JSON-LD, sitemap,
enlaces internos y noindex de shell privado/404. Lint termina sin errores, con advertencias
preexistentes en componentes privados y una advertencia de Fast Refresh en el entrypoint.
Vite advierte de un chunk grande del laboratorio y una externalización de DiceBear;
estos módulos se cargan en la aplicación privada.
La verificación visual automatizada quedó pendiente porque el navegador Chromium de Playwright
no estaba instalado en el entorno. No se han medido Core Web Vitals de campo ni Lighthouse.
La comprobación del despliegue y Search Console debe realizarse sobre producción tras publicar.

## Integridad del contenido

Python, IA y Robótica se presentan como ruta futura, no como cursos abiertos.
No se fabrican testimonios, calificaciones ni reseñas. La sección de experiencias solicita
ejemplos autorizados; debe sustituirse por testimonios reales solo cuando exista consentimiento.
Los artículos citan documentación primaria de Scratch y Roblox.
No se crean páginas para otras ciudades.
No se configura una redirección del dominio antiguo porque requiere controlar su hosting.
No se promete una posición en Google ni una fecha de indexación.
