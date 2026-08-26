# Notas para trabajar en este proyecto

Portfolio de Nil Mariages (agente de viajes) en Astro, en tres idiomas y
desplegado en Vercel. Lo que hay que saber antes de tocar nada:

## Imágenes: SIEMPRE en WebP

Ninguna foto entra al repositorio en su formato original. Toda imagen que
llegue (JPEG, JFIF, PNG, lo que sea) se convierte a **WebP** antes de
guardarla en `public/images/`:

```bash
node -e "require('sharp')('origen.jpg')
  .resize({width:1200,height:900,fit:'inside',withoutEnlargement:true})
  .webp({quality:74,effort:6})
  .toFile('public/images/xx.webp')"
```

Reglas que acompañan a la conversión:

- **Nombre = código ISO del país** en minúsculas (`tj.webp`, `qa.webp`). Es la
  clave con la que se indexan en `src/data/images.json`.
- **Ancho máximo 1200 px** sin recortar (`fit: 'inside'`). Las tarjetas se
  muestran a 600×450 y recortan por CSS con `object-fit: cover`, así que el
  recorte no se hornea en el fichero.
- **Calidad 74**. Sube solo si una foto concreta se ve mal; la mayoría quedan
  por debajo de 150 KB.
- Borra el original de la raíz cuando termines: no se versiona.

Excepción, los **logotipos**: van en SVG siempre que la marca lo publique
(`src/assets/logos/` si se incrusta, `public/images/` si se sirve aparte). Un
logo es color plano y bordes duros; pasarlo a WebP con pérdida lo estropea. Si
solo existe en mapa de bits, WebP **sin pérdida**, nunca lossy.

## Dónde vive el contenido

Casi todo es datos, no maquetación. El readme tiene la tabla completa; en
resumen: los textos de los tres idiomas en `src/i18n/{es,ca,en}.ts`, la
estructura de países y proyectos futuros en `src/data/countries.ts`, y las
fotos indexadas por ISO en `src/data/images.json`.

Los contadores de países (total y por continente) se calculan solos a partir de
`countries.ts`. Al añadir un país no hay que tocar ninguna cifra a mano.

## Idiomas

Todo cambio de contenido se aplica **en los tres diccionarios** (`es`, `ca`,
`en`). Si `types.ts` declara un campo, existe en los tres o el build falla.
