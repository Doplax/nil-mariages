// Estructura de las rutas/mapas (slug, país, año, geometría GeoJSON).
// El TEXTO (título, ubicación, descripción) vive en los diccionarios de i18n
// (`src/i18n/*`), indexado por slug.
//
// Para añadir rutas reales: exporta el mapa de Google My Maps como KML, ponlo
// en `maps_src/`, ejecuta `node scripts/kml-to-geojson.mjs`, importa el JSON
// generado aquí y añade su texto en cada diccionario (`trips['<slug>']`).

import type { FeatureCollection } from 'geojson';
import budapest from './trips/budapest-ejemplo.json';

export interface Trip {
  slug: string;
  /** Código ISO del país (para la bandera) */
  iso: string;
  year?: string;
  /** true si es un ejemplo de muestra y no una ruta real de Nil */
  sample?: boolean;
  data: FeatureCollection;
}

export const trips: Trip[] = [
  {
    slug: 'budapest-ejemplo',
    iso: 'hu',
    year: '2024',
    sample: true,
    data: budapest as FeatureCollection,
  },
];
