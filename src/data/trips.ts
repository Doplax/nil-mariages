// Rutas / mapas de viaje para mostrar en el portafolio.
//
// Cada ruta es un GeoJSON (FeatureCollection) que se renderiza sobre un mapa
// interactivo (Leaflet). Para añadir las rutas reales de Nil:
//   1. En Google My Maps: abre el mapa → menú (⋮) → "Exportar a KML/KMZ" →
//      marca "Exportar al formato KML en lugar de KMZ" y descarga el .kml.
//   2. Guarda el archivo en la carpeta `maps_src/` del proyecto.
//   3. Ejecuta `node scripts/kml-to-geojson.mjs` para convertirlo a GeoJSON
//      dentro de `src/data/trips/`.
//   4. Añade aquí una entrada nueva importando ese JSON.
//
// La ruta de Budapest incluida es solo un EJEMPLO para mostrar cómo se ve.

import type { FeatureCollection } from 'geojson';
import budapest from './trips/budapest-ejemplo.json';

export interface Trip {
  slug: string;
  title: string;
  /** Código ISO del país (para la bandera) */
  iso: string;
  location: string;
  year?: string;
  description: string;
  /** true si es un ejemplo de muestra y no una ruta real de Nil */
  sample?: boolean;
  data: FeatureCollection;
}

export const trips: Trip[] = [
  {
    slug: 'budapest-ejemplo',
    title: 'Budapest a pie',
    iso: 'hu',
    location: 'Budapest, Hungría',
    year: '2024',
    description:
      'Recorrido por los imprescindibles de Budapest: del Parlamento al Bastión de los Pescadores cruzando el Danubio. Ruta de ejemplo para ilustrar cómo se muestran los mapas de trabajo.',
    sample: true,
    data: budapest as FeatureCollection,
  },
];
