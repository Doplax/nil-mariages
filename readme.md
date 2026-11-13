# Nil Mariages — Portfolio

Web de presentación de **Nil Mariages**, agente de viajes y guía titulado especializado
en viajes a medida y grupos B2B. Funciona a la vez como carta de presentación y como CV:
recoge su trayectoria profesional, los países que ha visitado, ejemplos reales de
itinerarios que ha diseñado y un formulario de contacto directo.

**🔗 [nil-mariages.vercel.app](https://nil-mariages.vercel.app/)**

## Qué incluye

- **Hero + Sobre mí** — presentación, foto y contadores de países y continentes.
- **Trayectoria** — CV completo (experiencia, formación, idiomas, competencias, distinciones) y descarga en PDF.
- **Experiencia viajera** — los 43 países visitados agrupados por continente, con foto y descripción de cada uno.
- **Rutas sobre el mapa** — itinerarios reales embebidos desde Google My Maps, con carga diferida para no penalizar el rendimiento.
- **Planificaciones** — ejemplos de itinerarios día a día, con visor de PDF protegido (solo lectura, sin descarga) y **versión interactiva** de cada uno (`/planificaciones/albania` y `/planificaciones/kirguistan-uzbekistan`): mapa que sigue el día que se lee, horarios, hoteles, información práctica, conversor de moneda, platos y lista de equipaje con casillas (solo en castellano, como el PDF).
- **Proyectos futuros** — próximos destinos en preparación.
- **Testimonios y contacto** — reseñas de clientes y formulario que envía email por SMTP.

Todo el sitio está en **tres idiomas: español (por defecto), catalán e inglés**.

## Stack

[Astro](https://astro.build) · [Leaflet](https://leafletjs.com) para los mapas ·
[Nodemailer](https://nodemailer.com) para el formulario · desplegado en **Vercel**.

## Desarrollo

```bash
npm install
npm run dev      # servidor local
npm run build    # build de producción
npm run preview  # previsualizar el build
```

El formulario de contacto necesita credenciales SMTP en un `.env` (no versionado):

```
SMTP_USER=...
SMTP_PASS=...
```

## Dónde se edita el contenido

Casi todo el contenido es **datos, no maquetación**. Para actualizar la web normalmente
solo hay que tocar estos ficheros:

| Qué | Dónde |
| --- | --- |
| Todos los textos (los 3 idiomas) | `src/i18n/es.ts`, `ca.ts`, `en.ts` |
| Países visitados y proyectos futuros | `src/data/countries.ts` |
| Fotos de cada país (por código ISO) | `src/data/images.json` |
| Datos de contacto (email, teléfono, LinkedIn) | `src/data/cv.ts` |
| Logotipos de las empresas del CV | `src/assets/logos/`, `public/images/` |
| Rutas del mapa | `src/data/trips.ts` |
| CV en PDF y planificaciones | `public/` |
| Texto de cada día de una planificación interactiva | `src/pages/planificaciones/<plan>.astro` |
| Paradas y tramos del mapa, platos, maleta y moneda | `src/data/plans/<plan>.ts` |
| Fotos de una planificación interactiva | `public/images/planificaciones/<plan>/` |
| Contorno del mapa (generado) | `src/data/plans/<plan>-map.json` |

Los contadores de países (total y por continente) se calculan solos a partir de
`countries.ts`: al añadir un país, las cifras se actualizan sin tocar nada más.

## Scripts auxiliares

```bash
node scripts/fetch-images.mjs          # busca la foto de cada país en Wikipedia
node scripts/build-kyrgyzstan-map.mjs  # convierte el KML de Google My Maps a GeoJSON
node scripts/build-plan-map.mjs [plan] # contorno del mapa de una planificación interactiva (Natural Earth)
node scripts/plan-images.mjs <plan>    # versión de 480 px de sus fotos y lista de medidas
```

## Planificaciones interactivas

Comparten motor: `src/layouts/PlanLayout.astro` (barra del portfolio, cabecera
con los días, mapa, platos, maleta, pie y visor de fotos), `src/styles/plan.css`,
`src/scripts/plan.ts` (comportamiento) y `src/components/plan/` (foto y
conversor). Cada plan pone su paleta, su portada, el texto de los días y la
información práctica en su página, y lo demás en `src/data/plans/<plan>.ts`.

Para añadir una:

1. Fotos en WebP en `public/images/planificaciones/<plan>/` (1200 px, calidad
   74; las de los PDF traen un marco negro que hay que recortar) y
   `node scripts/plan-images.mjs <plan>`.
2. Recuadro y países del mapa en `PLANS` de `scripts/build-plan-map.mjs` y
   `node scripts/build-plan-map.mjs <plan>`.
3. `src/data/plans/<plan>.ts` (tipos en `types.ts`) y la página
   `src/pages/planificaciones/<plan>.astro`, copiando una de las que hay.
4. Campo `interactive` en la tarjeta de los tres diccionarios: con eso salen
   el botón de la tarjeta y el del visor de PDF.
