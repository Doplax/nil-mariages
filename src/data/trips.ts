// Rutas/mapas mostrados en "Mis rutas, sobre el mapa".
// El mapa de cada ruta es el embed de Google My Maps (endpoint `/embed`); el
// TEXTO (título, ubicación, descripción) vive en los diccionarios de i18n
// (`src/i18n/*`), indexado por slug.
//
// Para añadir una ruta: en Google My Maps → ⋮ → "Insertar en mi sitio" copia la
// URL del iframe (https://www.google.com/maps/d/embed?mid=...), añádela como
// `embedSrc` aquí y crea su texto en cada diccionario (`trips['<slug>']`).

export interface Trip {
  slug: string;
  /** Código ISO del país (para la bandera) */
  iso: string;
  year?: string;
  /** true si es un ejemplo de muestra y no una ruta real de Nil */
  sample?: boolean;
  /** URL embebible de Google My Maps (endpoint `/embed`). Es el mapa de la ruta. */
  embedSrc: string;
}

export const trips: Trip[] = [
  {
    slug: 'kyrgyzstan',
    iso: 'kg',
    year: '2023',
    embedSrc:
      'https://www.google.com/maps/d/embed?mid=1qqyWYKvoeOdxp3F7Va9uUVjcEXj-z7E&ll=42.82622247925957%2C77.3103865681725&z=8',
  },
];
