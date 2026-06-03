// Genera el GeoJSON curado de la ruta de Kirguistán a partir del mapa real de
// Google My Maps (maps_src/kyrgyzstan.kml).
//
// El mapa original tiene 169 elementos repartidos en carpetas. Para el mapa
// interactivo (Leaflet) nos quedamos con lo que cuenta una historia limpia:
//   · TODAS las polilíneas (los recorridos), simplificadas para no inflar el bundle.
//   · Los puntos de interés curados: carpetas "BISHKEK" y "Kyrguistán".
// Y descartamos el ruido logístico:
//   · La carpeta "GASOLINERAS" (54 puntos).
//   · Los puntos sueltos de las carpetas de "Indicaciones..." (waypoints duplicados).
//
// El mapa COMPLETO (con gasolineras y todo el detalle) sigue disponible en la web
// a través del embed de Google My Maps (ver `embedSrc` en src/data/trips.ts).
//
// Uso:  node scripts/build-kyrgyzstan-map.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { kml as toGeoJSON } from '@tmcw/togeojson';

const SRC = new URL('../maps_src/kyrgyzstan.kml', import.meta.url);
const OUT = new URL('../src/data/trips/kyrgyzstan.json', import.meta.url);

// Carpetas cuyos PUNTOS queremos conservar en el mapa interactivo.
const KEEP_POINT_FOLDERS = new Set(['BISHKEK', 'Kyrguistán']);
// Tolerancia de simplificación de líneas en grados (~0,0008° ≈ 80–90 m).
const SIMPLIFY_TOLERANCE = 0.0008;

const xml = readFileSync(SRC, 'utf8');
const dom = new DOMParser({ onError: () => {} }).parseFromString(xml, 'text/xml');
const serializer = new XMLSerializer();

const directChildName = (node) => {
  for (const c of Array.from(node.childNodes)) {
    if (c.nodeName === 'name') return c.textContent.trim();
  }
  return '';
};

// Convierte una carpeta KML a features GeoJSON, etiquetando cada una con su carpeta.
function folderToFeatures(folder, folderName) {
  const wrapped =
    '<kml xmlns="http://www.opengis.net/kml/2.2"><Document>' +
    serializer.serializeToString(folder) +
    '</Document></kml>';
  const fdom = new DOMParser({ onError: () => {} }).parseFromString(wrapped, 'text/xml');
  const gj = toGeoJSON(fdom);
  for (const f of gj.features) f.properties = { ...(f.properties || {}), folder: folderName };
  return gj.features;
}

// --- Douglas–Peucker para adelgazar las polilíneas road-snapped de Google ---
function perpDist([px, py], [ax, ay], [bx, by]) {
  const dx = bx - ax;
  const dy = by - ay;
  if (dx === 0 && dy === 0) return Math.hypot(px - ax, py - ay);
  const t = ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy);
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
}
function simplify(points, tol) {
  if (points.length < 3) return points;
  let maxD = 0;
  let idx = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const d = perpDist(points[i], points[0], points[points.length - 1]);
    if (d > maxD) {
      maxD = d;
      idx = i;
    }
  }
  if (maxD > tol) {
    const left = simplify(points.slice(0, idx + 1), tol);
    const right = simplify(points.slice(idx), tol);
    return left.slice(0, -1).concat(right);
  }
  return [points[0], points[points.length - 1]];
}
function simplifyGeometry(geom) {
  if (geom.type === 'LineString') {
    geom.coordinates = simplify(geom.coordinates, SIMPLIFY_TOLERANCE);
  } else if (geom.type === 'MultiLineString') {
    geom.coordinates = geom.coordinates.map((l) => simplify(l, SIMPLIFY_TOLERANCE));
  }
  return geom;
}

// Limpia las propiedades: solo nos interesa el nombre y la descripción para el popup.
function cleanProps(props = {}) {
  const out = {};
  if (props.name) out.name = String(props.name).trim();
  const desc = (props.description || '').toString().trim();
  // Descarta descripciones que en realidad son HTML de estilos/imágenes de Google.
  if (desc && !/^<.*>$/s.test(desc)) out.description = desc;
  return out;
}

const folders = dom.getElementsByTagName('Folder');
const keptLines = [];
const keptPoints = [];
let droppedPoints = 0;

for (let i = 0; i < folders.length; i++) {
  const folder = folders[i];
  const name = directChildName(folder) || '(sin nombre)';
  const features = folderToFeatures(folder, name);

  for (const f of features) {
    const type = f.geometry?.type || '';
    if (/LineString/.test(type)) {
      simplifyGeometry(f.geometry);
      f.properties = cleanProps(f.properties);
      f.properties.kind = 'route';
      keptLines.push(f);
    } else if (type === 'Point') {
      if (KEEP_POINT_FOLDERS.has(name)) {
        f.properties = cleanProps(f.properties);
        f.properties.kind = 'poi';
        keptPoints.push(f);
      } else {
        droppedPoints++;
      }
    }
  }
}

// Dedup de puntos por nombre+coordenada (el mapa original repite algunos waypoints).
const seen = new Set();
const dedupPoints = keptPoints.filter((f) => {
  const key = `${f.properties.name}@${f.geometry.coordinates.map((n) => n.toFixed(4)).join(',')}`;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

const out = {
  type: 'FeatureCollection',
  features: [...keptLines, ...dedupPoints],
};

writeFileSync(OUT, JSON.stringify(out) + '\n');

const coordCount = keptLines.reduce((a, f) => {
  const g = f.geometry;
  return a + (g.type === 'MultiLineString'
    ? g.coordinates.reduce((s, l) => s + l.length, 0)
    : g.coordinates.length);
}, 0);
const bytes = readFileSync(OUT).length;
console.log(`✓ src/data/trips/kyrgyzstan.json`);
console.log(`  Recorridos: ${keptLines.length}  (${coordCount} vértices tras simplificar)`);
console.log(`  Puntos:     ${dedupPoints.length}  (descartados ${droppedPoints} de gasolineras/waypoints)`);
console.log(`  Tamaño:     ${(bytes / 1024).toFixed(1)} KB`);
