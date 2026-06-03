// Estructura de las rutas/mapas (slug, país, año, geometría GeoJSON).
// El TEXTO (título, ubicación, descripción) vive en los diccionarios de i18n
// (`src/i18n/*`), indexado por slug.
//
// Para añadir rutas reales: exporta el mapa de Google My Maps como KML, ponlo
// en `maps_src/`, ejecuta `node scripts/kml-to-geojson.mjs`, importa el JSON
// generado aquí y añade su texto en cada diccionario (`trips['<slug>']`).
//
// La ruta de Kirguistán se genera con `node scripts/build-kyrgyzstan-map.mjs`
// (versión curada y simplificada del mapa real de Google My Maps). El mapa
// COMPLETO se ofrece además como embed interactivo vía `embedSrc`.

import type { FeatureCollection } from 'geojson';
import budapest from './trips/budapest-ejemplo.json';
import kyrgyzstan from './trips/kyrgyzstan.json';

export interface Trip {
  slug: string;
  /** Código ISO del país (para la bandera) */
  iso: string;
  year?: string;
  /** true si es un ejemplo de muestra y no una ruta real de Nil */
  sample?: boolean;
  /**
   * URL embebible de Google My Maps (endpoint `/embed`). Si está presente, la
   * sección muestra un botón para ver el mapa original completo en un iframe.
   */
  embedSrc?: string;
  data: FeatureCollection;
}

export const trips: Trip[] = [
  {
    slug: 'kyrgyzstan',
    iso: 'kg',
    year: '2023',
    embedSrc:
      'https://www.google.com/maps/d/embed?mid=1qqyWYKvoeOdxp3F7Va9uUVjcEXj-z7E&ll=42.82622247925957%2C77.3103865681725&z=8',
    data: kyrgyzstan as FeatureCollection,
  },
  {
    slug: 'budapest-ejemplo',
    iso: 'hu',
    year: '2024',
    sample: true,
    data: budapest as FeatureCollection,
  },
];
