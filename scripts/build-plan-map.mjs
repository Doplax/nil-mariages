// Genera el contorno del mapa de una planificación interactiva
// (src/data/plans/<plan>-map.json) a partir de Natural Earth 1:10m
// (paquete world-atlas en jsDelivr). Proyección equirectangular centrada en
// la latitud de referencia; los parámetros se guardan en el JSON y
// src/scripts/plan.ts sitúa las paradas con ellos.
//
//   node scripts/build-plan-map.mjs            (todas)
//   node scripts/build-plan-map.mjs albania    (una)
//
// Los puntos que quedan fuera del recuadro se pegan al borde (con margen), de
// modo que los países vecinos grandes (Grecia, Italia) pesan poco.
import { writeFile, mkdir } from 'node:fs/promises';

const SOURCE = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-10m.json';
// Lagos de Natural Earth 1:10m (Issyk-Kul, Shkodër, Ohrid…); los muy pequeños no salen
const LAKES = 'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@v5.1.2/geojson/ne_10m_lakes.geojson';

const PLANS = {
  albania: {
    out: 'src/data/plans/albania-map.json',
    lon0: 18.55, lon1: 21.25, lat0: 39.45, lat1: 42.75, latRef: 41.1, k: 200, pad: 40,
    main: ['008'], // Albania (ISO numérico)
    neighbours: ['499', '807', '300', '380', '688', '070'], // Montenegro, Macedonia del Norte, Grecia, Italia, Serbia, Bosnia
    neighbourNames: ['Kosovo'], // sin código ISO en Natural Earth
  },
  // Muy ancho y el mapa de la página es vertical: se genera bastante norte y
  // sur (Kazajistán, Tayikistán, Afganistán) para que la vista general no
  // enseñe bordes cortados. Vecinos: todos los países que caen dentro.
  'kirguistan-uzbekistan': {
    out: 'src/data/plans/kirguistan-uzbekistan-map.json',
    lon0: 62.3, lon1: 80.7, lat0: 31.5, lat1: 51, latRef: 41.2, k: 40, pad: 120, tol: 0.35, minSize: 1.5,
    main: ['417', '860'], // Kirguistán y Uzbekistán
    neighbours: 'all',
    neighbourNames: [],
  },
};

const topo = await (await fetch(SOURCE)).json();
const lakes = await (await fetch(LAKES)).json();
const [sx, sy] = topo.transform.scale;
const [tx, ty] = topo.transform.translate;
const arcs = topo.arcs.map((arc) => {
  let x = 0, y = 0;
  return arc.map(([dx, dy]) => { x += dx; y += dy; return [x * sx + tx, y * sy + ty]; });
});

function ringPoints(ring) {
  const out = [];
  ring.forEach((ai, i) => {
    const pts = ai >= 0 ? arcs[ai] : [...arcs[~ai]].reverse();
    out.push(...(i === 0 ? pts : pts.slice(1)));
  });
  return out;
}

const only = process.argv[2];
for (const [name, p] of Object.entries(PLANS)) {
  if (only && only !== name) continue;
  const cos = Math.cos((p.latRef * Math.PI) / 180);
  const W = (p.lon1 - p.lon0) * cos * p.k;
  const H = (p.lat1 - p.lat0) * p.k;
  const PAD = p.pad;
  const r1 = (n) => Math.round(n * 10) / 10;
  const proj = ([lon, lat]) => [(lon - p.lon0) * cos * p.k, (p.lat1 - lat) * p.k];

  // Douglas-Peucker: quita los puntos que se desvían menos de `tol` unidades
  // de la línea (solo si el plan lo pide; Albania va sin simplificar)
  const simplify = (pts, tol) => {
    if (!tol || pts.length < 4) return pts;
    const keep = new Uint8Array(pts.length);
    // Los anillos están cerrados (primer punto = último): se parten por el
    // punto más lejano del primero para que la recta de referencia no sea nula
    const n = pts.length - 1;
    let far = 1, farD = -1;
    for (let i = 1; i < n; i++) {
      const d = Math.hypot(pts[i][0] - pts[0][0], pts[i][1] - pts[0][1]);
      if (d > farD) { farD = d; far = i; }
    }
    keep[0] = keep[n] = keep[far] = 1;
    const stack = [[0, far], [far, n]];
    while (stack.length) {
      const [a, b] = stack.pop();
      const [ax, ay] = pts[a], [bx, by] = pts[b];
      const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
      let max = 0, idx = -1;
      for (let i = a + 1; i < b; i++) {
        const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + bx * ay - by * ax) / len;
        if (d > max) { max = d; idx = i; }
      }
      if (max > tol) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
    }
    return pts.filter((_, i) => keep[i]);
  };

  const ringPath = (pts) => {
    let xy = [];
    for (const pt of pts) {
      let [x, y] = proj(pt);
      x = r1(Math.min(Math.max(x, -PAD), W + PAD));
      y = r1(Math.min(Math.max(y, -PAD), H + PAD));
      const last = xy[xy.length - 1];
      if (!last || last[0] !== x || last[1] !== y) xy.push([x, y]);
    }
    if (xy.length < 3) return '';
    const xs = xy.map((q) => q[0]), ys = xy.map((q) => q[1]);
    const outside = Math.max(...xs) <= -PAD + 0.1 || Math.min(...xs) >= W + PAD - 0.1 ||
      Math.max(...ys) <= -PAD + 0.1 || Math.min(...ys) >= H + PAD - 0.1;
    if (outside) return '';
    // Islas y lagos más pequeños que `minSize` unidades no se ven: fuera
    if (p.minSize && Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) < p.minSize) return '';
    xy = simplify(xy, p.tol);
    if (xy.length < 3) return '';
    return 'M' + xy.map(([x, y]) => `${x},${y}`).join('L') + 'Z';
  };

  // La proyección va en el JSON: el script de la página la lee de ahí
  const out = { W: r1(W), H: r1(H), lon0: p.lon0, lat1: p.lat1, latRef: p.latRef, k: p.k, main: '', neighbours: '', lakes: '' };
  for (const g of topo.objects.countries.geometries) {
    const isMain = p.main.includes(g.id);
    const isNeighbour = p.neighbours === 'all' || p.neighbours.includes(g.id) || p.neighbourNames.includes(g.properties?.name);
    if (!isMain && !isNeighbour) continue;
    const polys = g.type === 'MultiPolygon' ? g.arcs : [g.arcs];
    const d = polys.flatMap((poly) => poly.map((ring) => ringPath(ringPoints(ring)))).join('');
    if (isMain) out.main += d; else out.neighbours += d;
  }
  for (const f of lakes.features) {
    const g = f.geometry;
    const polys = g.type === 'MultiPolygon' ? g.coordinates : [g.coordinates];
    out.lakes += polys.flatMap((poly) => poly.map((ring) => ringPath(ring))).join('');
  }

  await mkdir(new URL('../src/data/plans/', import.meta.url), { recursive: true });
  await writeFile(new URL('../' + p.out, import.meta.url), JSON.stringify(out));
  console.log(`${name}: ${p.out} (${out.W}×${out.H}, ${Math.round((out.main.length + out.neighbours.length + out.lakes.length) / 1024)} KB)`);
}
