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

## ✅ Entrega
- [x] Crear este `todo.md`.
- [x] `npm run build` sin errores.
- [x] Commits siguiendo **Conventional Commits**.
- [x] Desplegar en **Vercel** vía CLI → https://nil-mariages.vercel.app

## Notas
- Las descripciones están generadas con IA y son orientativas.
- Las imágenes de países se sirven desde LoremFlickr (licencia Creative Commons).
  Para usar imágenes propias, basta con cambiar el `imageQuery` por una URL en
  `src/data/countries.ts` y ajustar `CountryCard.astro` / `Future.astro`.
