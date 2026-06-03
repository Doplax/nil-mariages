# TODO — Portfolio Nil Mariages

Portfolio de **Nil Mariages**, agente de viajes, hecho con **Astro**, siguiendo
las indicaciones de las capturas de WhatsApp (colores navy + teal tomados como
referencia, foto "sobre mí", experiencia viajera internacional destacada y
futuros proyectos). *Haya travel era solo la referencia de paleta de color, no
la marca: la web es de Nil Mariages con logo propio.*

Desplegado en → **https://nil-mariages.vercel.app**

---

## ✅ Preparación
- [x] Foto perfil: `.jfif` → `public/images/nil-mariages.webp` (800×800, 54 KB).

## ✅ Proyecto Astro
- [x] Paleta de marca: navy `#0e2336` + teal `#5fc9bc`.
- [x] Logo propio + favicon SVG de Nil Mariages.
- [x] `astro.config.mjs` con i18n, sitemap y site URL.

## ✅ Contenido y países
- [x] Asia (14): KG, TH, ID, MY, NP, LA, KH, UZ, TJ, QA, SG, TR, IN, VN.
- [x] América (2): VE, US.
- [x] África (2): EG, MA.
- [x] Europa (23): AL, RS, SK, AT, HU, CH, DE, DK, SE, PL, CZ, NL, BG, PT, IT, FR, MC, BE, GB, IE, AD, ES, VA.
- [x] Total: **41 países** (stat dinámica).
- [x] Futuros proyectos: PK, CN, CO, PE, Ruta Báltico (LT/LV/EE/FI).
- [x] Imágenes reales de lugares emblemáticos (Wikimedia Commons), indexadas por ISO.
- [x] Banderas SVG nítidas (`flag-icons`).

## ✅ Secciones de la web
- [x] **Hero** con rutas de vuelo animadas (SVG + offset-path) y estadísticas.
- [x] **Sobre mí** con foto y texto de perfil.
- [x] **Trayectoria** (CV completo): experiencia, educación, idiomas, competencias, distinciones. Botón Descargar CV.
- [x] **Experiencia viajera**: Asia/América/África destacados, Europa compacto (globe emoji, tira de banderas).
- [x] **Rutas y mapas** (Leaflet, carga diferida): Budapest a pie + Kirguistán en 4x4.
- [x] **Planificaciones**: Albania 7 días + KG/UZ 15 días, expandible día a día.
- [x] **Futuros proyectos**: formato FutureCard (foto + texto blanco, fondo navy), 5 entradas.
- [x] **Testimonios**: carrusel 6 reseñas (3 visibles, flechas + dots). 2 reales de Google.
- [x] **CTA** con icono de email.
- [x] **Formulario de contacto** (Web3Forms, zero-backend). Pendiente: `PUBLIC_WEB3FORMS_KEY` en Vercel.
- [x] **Footer** con contacto real.

## ✅ UX y rendimiento
- [x] Responsive + hamburguesa móvil con trampa de foco (ESC, Tab).
- [x] Nav activo: sección visible en pantalla resaltada en el menú.
- [x] Botón "volver arriba" (aparece al scrollear > 400 px).
- [x] Animaciones suaves y sutiles (stagger scroll reveal, hero entrance, micro-hovers).
- [x] Efecto parallax en hero y CTA.
- [x] WhatsApp flotante (burbuja, se oculta en el hero).
- [x] View Transitions (`<ClientRouter />`).
- [x] Skip-to-content link (accesibilidad).
- [x] Fuente Inter autoalojada (sin Google Fonts bloqueante).
- [x] Leaflet con carga diferida (solo al acercarse al mapa).
- [x] **Rendimiento Lighthouse móvil: 98 / 98 / 100 / 100**.

## ✅ SEO y técnica
- [x] `@astrojs/sitemap` → `/sitemap-index.xml` (ES, EN, CA).
- [x] `robots.txt` con enlace al sitemap.
- [x] JSON-LD `Person + LocalBusiness` en `<head>`.
- [x] `hreflang` para ES / EN / CA + x-default.
- [x] Open Graph + `og:locale` por idioma.
- [x] `vercel.json` con cache headers para assets estáticos.

## ✅ Internacionalización (i18n)
- [x] Español (`/`), inglés (`/en/`), catalán (`/ca/`).
- [x] Selector de idioma en cabecera y en menú móvil.
- [x] Todo el texto en diccionarios TypeScript (`src/i18n/`).

---

## Pendiente (necesita acción de Nil)

- [ ] **Formulario de contacto activo**: registrarse en https://web3forms.com (gratis),
      copiar la access key y añadirla en Vercel → Settings → Environment Variables
      como `PUBLIC_WEB3FORMS_KEY`.
- [ ] **Rutas KML reales**: exportar mapas de Google My Maps como KML,
      ponerlos en `maps_src/` y ejecutar `node scripts/kml-to-geojson.mjs`.
- [ ] **Reseñas reales adicionales**: pasar más reseñas de Google para sustituir los placeholders del carrusel.
- [ ] **Analítica**: crear cuenta en https://plausible.io y añadir
      `PUBLIC_PLAUSIBLE_DOMAIN=nil-mariages.vercel.app` en Vercel env vars.
- [ ] **Instagram**: si tiene cuenta activa, proporcionar el handle para añadir enlace en el footer.
