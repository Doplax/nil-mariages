# TODO — Portfolio Nil Mariages · Haya travel

Portfolio de agente de viajes hecho con **Astro**, siguiendo las indicaciones
de las capturas de WhatsApp (marca *Haya travel*, colores navy + teal, foto
"sobre mí", experiencia viajera internacional destacada y futuros proyectos).

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
- [x] Crear el componente de logo *Haya travel*.
- [x] Crear favicon SVG con la marca.

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
- [x] Asignar una **imagen representativa** a cada país (LoremFlickr, CC),
      fácilmente sustituible por una propia.

## ✅ Secciones de la web
- [x] **Hero** con presentación y estadísticas (+países, continentes).
- [x] **Sobre mí** con la foto y el texto de perfil profesional.
- [x] **Experiencia viajera** con lo internacional destacado y Europa compacta.
- [x] **Futuros proyectos**.
- [x] **Contacto / Footer**.
- [x] Estilos responsive + animaciones de aparición al hacer scroll.

## ✅ Entrega
- [x] Crear este `todo.md`.
- [x] `npm run build` sin errores.
- [x] Commits siguiendo **Conventional Commits**.
- [ ] Desplegar en **Vercel** vía CLI.

## Notas
- Las descripciones están generadas con IA y son orientativas.
- Las imágenes de países se sirven desde LoremFlickr (licencia Creative Commons).
  Para usar imágenes propias, basta con cambiar el `imageQuery` por una URL en
  `src/data/countries.ts` y ajustar `CountryCard.astro` / `Future.astro`.
