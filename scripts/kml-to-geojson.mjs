// Convierte los mapas exportados de Google My Maps (KML) a GeoJSON.
//
// Flujo de trabajo:
//   1. En Google My Maps: abre el mapa → menú (⋮) → "Exportar a KML/KMZ".
//      Marca "Exportar al formato KML en lugar de KMZ" y descarga el .kml.
//   2. Copia el/los .kml en la carpeta `maps_src/`.
//   3. Ejecuta:  node scripts/kml-to-geojson.mjs
//   4. Se generará un .json en `src/data/trips/` por cada .kml.
//   5. Añade la ruta en `src/data/trips.ts` importando ese JSON.
//
// (Si solo puedes exportar KMZ, descomprímelo —es un .zip— y usa el doc.kml
//  que contiene dentro.)

import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { DOMParser } from '@xmldom/xmldom';
import { kml } from '@tmcw/togeojson';

const srcDir = new URL('../maps_src/', import.meta.url);
const outDir = new URL('../src/data/trips/', import.meta.url);

if (!existsSync(srcDir)) {
  console.error('No existe la carpeta maps_src/. Crea la carpeta y pon dentro los .kml.');
  process.exit(1);
}
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const kmlFiles = readdirSync(srcDir).filter((f) => f.toLowerCase().endsWith('.kml'));

if (!kmlFiles.length) {
  console.log('No se han encontrado archivos .kml en maps_src/.');
  console.log('Exporta tus mapas de Google My Maps como KML y colócalos ahí.');
  process.exit(0);
}

for (const file of kmlFiles) {
  const xml = readFileSync(new URL(file, srcDir), 'utf8');
  const dom = new DOMParser().parseFromString(xml, 'text/xml');
  const geojson = kml(dom);

  const slug = slugify(file.replace(/\.kml$/i, ''));
  const outName = `${slug}.json`;
  writeFileSync(new URL(outName, outDir), JSON.stringify(geojson, null, 2) + '\n');

  const points = geojson.features.filter((f) => f.geometry?.type === 'Point').length;
  const lines = geojson.features.filter((f) => /LineString/.test(f.geometry?.type || '')).length;
  console.log(`✓ ${file} → src/data/trips/${outName}  (${points} puntos, ${lines} recorridos)`);
  console.log(`  Añade en src/data/trips.ts:`);
  console.log(`    import ${slug.replace(/-/g, '_')} from './trips/${outName}';`);
  console.log(`    { slug: '${slug}', title: '...', iso: 'xx', location: '...', description: '...', data: ${slug.replace(/-/g, '_')} as FeatureCollection },\n`);
}

console.log('Listo. Revisa src/data/trips.ts para registrar las rutas nuevas.');
