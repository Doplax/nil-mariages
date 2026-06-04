# TODO — Portfolio Nil Mariages

Portfolio de **Nil Mariages**, agente de viajes, hecho con **Astro**, siguiendo
las indicaciones de las capturas de WhatsApp (colores navy + teal tomados como
referencia, foto "sobre mí", experiencia viajera internacional destacada y
futuros proyectos). *Haya travel era solo la referencia de paleta de color, no
la marca: la web es de Nil Mariages con logo propio.*

Desplegado en → **https://nil-mariages.vercel.app**

---

## 🔧 Correcciones pendientes (revisión de Nil — 2026-06-04)

Lote de correcciones detectadas sobre capturas anotadas. Cada punto explica
**qué falla**, **por qué** y **qué hacer**.

- [x] **1. Mapa de la sección Rutas "se ve culero" (iframe diminuto).**
      En `TripsSection.astro`, al pulsar la fachada se inserta el `<iframe>` del
      embed de Google My Maps con clase `.trip-embed` (`width:100%;height:100%`).
      El iframe se queda al tamaño intrínseco por defecto (≈300×150 px) en la
      esquina superior izquierda en vez de rellenar la caja 16:9, dejando un
      enorme hueco gris ("se ve culero" / "el texto está bastante mal" señalan
      ese hueco). **Qué hacer:** posicionar el iframe en absoluto
      (`position:absolute; inset:0`) dentro de `.trip-stage` para que rellene
      siempre el contenedor con independencia de cómo resuelva el `height:100%`.
      Archivo: `src/components/TripsSection.astro` (CSS `.trip-embed`).

- [x] **2. Quitar el año en la ficha de ruta ("Kirguistán · 2023").**
      En `TripsSection.astro` el `locationLabel` concatena
      `` `${location} · ${year}` ``. Nil quiere que NO aparezca el año.
      **Qué hacer:** mostrar solo `text.location` (sin ` · año`). Archivo:
      `src/components/TripsSection.astro` (constante `locationLabel`).

- [x] **3. CTA: "+41 países" → "más de 40".**
      El número exacto (41, dinámico) "queda raro"; Nil prefiere "más de 40".
      El texto del CTA usa `+{count}` interpolado con `totalCountries`.
      **Qué hacer:** cambiar el texto en los 3 idiomas (`es/en/ca`) a "más de
      40 países" / "more than 40 countries" / "més de 40 països" y dejar de
      interpolar el contador en `CTA.astro` (quitar imports `totalCountries` e
      `interpolate` si quedan sin uso). Archivos: `src/i18n/{es,en,ca}.ts`
      (`ui.cta.text`) y `src/components/CTA.astro`.

- [x] **4. Iconos en la columna "Contacto" del footer ("los emojis molarían aquí también").**
      El formulario de contacto muestra los enlaces con icono (mail, teléfono,
      WhatsApp, LinkedIn), pero la columna Contacto del footer son enlaces de
      texto pelados. **Qué hacer:** añadir los mismos iconos SVG (mail, teléfono,
      WhatsApp, LinkedIn y un pin de ubicación para Barcelona) a cada enlace del
      footer, con los colores de marca de WhatsApp/LinkedIn. Archivo:
      `src/layouts/Layout.astro` (footer, columna `contactTitle`) + CSS del footer.

- [x] **5. "Falta el punto" en LICENCIAS (CV).**
      En `Resume.astro` la lista de licencias es un `<ul class="dots-list">` con
      viñetas. El item que contiene el logo SSI usa `class="license-ssi"` con
      `display:flex`, y `display:flex` en un `<li>` ELIMINA su viñeta (marker).
      Por eso "Advanced Open Water Diver (AOWD) – [SSI]" aparece sin punto
      mientras "Carné de conducir B" sí lo tiene. **Qué hacer:** que ese `<li>`
      conserve su viñeta (no usar `display:flex` en el `li`; el logo SSI ya es
      inline con `vertical-align:middle`, basta con alinearlo en línea).
      Archivo: `src/components/Resume.astro` (CSS `.license-ssi`).

- [x] **6. Revisar el día a día de "Kirguistán y Uzbekistán en 18 días".** ⚠️ Validar con Nil.
      Suma correctamente 18 días y los nombres/monumentos son correctos, pero
      dos entradas son genéricas/flojas: "Días 7-8 — Noches en yurta" (sin
      nombrar el lago icónico) y "Día 9 — Regreso a Bishkek / Travesía por el
      corazón de Kirguistán" (relleno vago). **Qué hacer:** concretar los días
      7-8 nombrando **Song-Köl** (el lago alpino donde se duerme en yurta, la
      experiencia estrella) y dar contenido real al día 9 (descenso por
      Kochkor / desfiladero de Boom). En los 3 idiomas. ⚠️ Es contenido: Nil
      debe validar que casa con su itinerario real. Archivos:
      `src/i18n/{es,en,ca}.ts` (`ui.planning.items[1].days`).

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
