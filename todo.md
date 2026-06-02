# TODO — Portfolio Nil Mariages

Portfolio de **Nil Mariages**, agente de viajes, hecho con **Astro**, siguiendo
las indicaciones de las capturas de WhatsApp (colores navy + teal tomados como
referencia, foto "sobre mí", experiencia viajera internacional destacada y
futuros proyectos). *Haya travel era solo la referencia de paleta de color, no
la marca: la web es de Nil Mariages con logo propio.*

## ✅ Preparación
- [x] Explorar el directorio y revisar la imagen aportada (`.jfif`).
- [x] Convertir la foto `.jfif` a **WebP**, recortarla y renombrarla a
      `public/images/nil-mariages.webp` (usada como foto del "Sobre mí").
- [x] Eliminar el archivo original `.jfif`.

## ✅ Proyecto Astro
- [x] Crear `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`.
- [x] Instalar dependencias (`astro`, `sharp`).
- [x] Definir la paleta de marca: **navy** (`#0e2336`) + **teal** (`#5fc9bc`),
      tal y como pidió el cliente ("los colores me molarían así").
- [x] Crear un **logo propio de Nil Mariages** (marca avión de papel + wordmark).
- [x] Crear favicon SVG con la marca de Nil Mariages.

## ✅ Contenido
- [x] Estructurar los países por continente en `src/data/countries.ts`.
  - [x] Asia (continente favorito): Kirguistán, Tailandia, Indonesia, Malasia,
        Nepal, Laos, Camboya, Uzbekistán, Tayikistán, Qatar, Singapur, Turquía.
  - [x] América: Venezuela, Estados Unidos.
  - [x] África: Egipto, Marruecos.
  - [x] Europa (22 países, presentación más compacta porque "Europa no es tan
        interesante" y hay muchos mapas).
  - [x] Futuros proyectos: Pakistán, China, Colombia.
- [x] Redactar una **breve descripción (con IA)** para cada país.
- [x] Asignar una **imagen real del lugar** a cada país (foto de un landmark
      icónico desde Wikimedia Commons, vía `scripts/fetch-images.mjs`) — son
      LUGARES, no personas.
- [x] Banderas como imagen (flagcdn.com) en vez de emoji, para que se vean en
      cualquier sistema operativo (Windows incluido).

## ✅ Secciones de la web
- [x] **Hero** con presentación y estadísticas (+países, continentes).
- [x] **Sobre mí** con la foto y el texto de perfil profesional.
- [x] **Experiencia viajera** con lo internacional destacado y Europa compacta.
- [x] **Futuros proyectos**.
- [x] **CTA de contacto** ("¿Listo para tu próximo viaje?").
- [x] **Contacto / Footer**.
- [x] Estilos responsive + animaciones de aparición al hacer scroll.

## ✅ Mejoras de interfaz (2ª iteración)
- [x] Rebranding completo a Nil Mariages (logo, favicon, textos, metadatos).
- [x] Imágenes de países reales (lugares, no personas) desde Wikimedia.
- [x] Banderas reales (flagcdn) en tarjetas y cabeceras de continente.
- [x] Tarjetas de país con nombre sobre la imagen y degradado para legibilidad.
- [x] Tira de banderas en las cabeceras de los continentes destacados.

## ✅ Mejoras de interfaz (3ª iteración)
- [x] Banderas **SVG** nítidas (flag-icons) en lugar de PNG borrosas; corregido
      el bug que las estiraba enormes (selector `:first-child`).
- [x] Hero rediseñado: fuera el degradado raro, **rutas de vuelo animadas** con
      aviones en movimiento (SVG + offset-path).
- [x] **Efecto parallax** suave en el hero y en el avión del CTA.
- [x] Animaciones suaves y sutiles: entrada escalonada (stagger) al hacer scroll,
      entrada del hero al cargar, subrayado animado en el menú, micro-hovers.
      Todo respeta `prefers-reduced-motion`.

## ✅ Currículum (CV)
- [x] Sección **Trayectoria** con la info del CV bien estructurada en la web:
      experiencia (timeline), educación, competencias, idiomas (con barras),
      distinciones y datos de interés.
- [x] Botón **Descargar CV (PDF)** (el PDF vive en `public/`).
- [x] Datos de contacto reales del CV (email, teléfono, WhatsApp, Barcelona).

## ✅ Mapas / Rutas
- [x] Sección **Rutas** con mapa interactivo (Leaflet + tiles CARTO).
- [x] Script `scripts/kml-to-geojson.mjs` para convertir mapas de Google My Maps
      (KML) a GeoJSON. Instrucciones en `maps_src/README.md`.
- [x] Ruta de **ejemplo** (Budapest) para mostrar cómo se ven los mapas.
- [ ] Sustituir el ejemplo por las rutas reales de Nil (pendiente de sus KML).

## ✅ Arquitectura / componentes
- [x] Componentizado lo reutilizable: `Button`, `SectionHeader`, `Reveal`,
      `Chip`, `Stat`, `Flag` (+ clase utilitaria `.card`).
- [x] Contacto + botón de WhatsApp destacados al final (CTA) y en el footer.

## ✅ Internacionalización (i18n)
- [x] Web en **español** (`/`), **inglés** (`/en/`) y **catalán** (`/ca/`).
- [x] Todo el texto (UI + contenido) en diccionarios por idioma (`src/i18n/`).
- [x] **Selector de idioma** en la cabecera y etiquetas `hreflang` para SEO.

## ✅ Cabecera responsive
- [x] Menú **hamburguesa** en móvil con panel desplegable y animación.

## ✅ Rendimiento (Lighthouse, móvil)
- [x] Fuente Inter **autoalojada** (sin petición bloqueante a Google Fonts).
- [x] Mapa Leaflet con **carga diferida** (solo al acercarse al viewport).
- [x] Resultado: **Rendimiento 98**, Accesibilidad 98, Buenas prácticas 100,
      SEO 100 (FCP 1,6 s · LCP 2,1 s · TBT 0 ms · CLS 0).

## ✅ Entrega
- [x] `npm run build` sin errores y verificación visual con capturas.
- [x] Commits siguiendo **Conventional Commits**.
- [x] Desplegar en **Vercel** vía CLI → https://nil-mariages.vercel.app

## Notas
- Las descripciones de países están generadas con IA y son orientativas.
- Las imágenes de países son fotos reales de lugares emblemáticos (Wikimedia
  Commons), regenerables con `node scripts/fetch-images.mjs`.
