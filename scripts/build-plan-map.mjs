// Genera el contorno del mapa de una planificación interactiva
// (src/data/plans/<plan>-map.json) a partir de Natural Earth 1:10m
// (paquete world-atlas en jsDelivr). Proyección equirectangular centrada en
// la latitud media: la misma que usa el script de la página para situar las
// paradas, así que si cambias aquí los límites cámbialos también allí.
//
//   node scripts/build-plan-map.mjs
//
// Los puntos que quedan fuera del recuadro se pegan al borde (con margen), de
// modo que los países vecinos grandes (Grecia, Italia) pesan poco.
import { writeFile, mkdir } from 'node:fs/promises';

const SOURCE = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-10m.json';

const PLANS = {
  albania: {
    out: 'src/data/plans/albania-map.json',
    lon0: 18.55, lon1: 21.25, lat0: 39.45, lat1: 42.75, latRef: 41.1, k: 200,
    main: '008', // Albania (ISO numérico)
    neighbours: ['499', '807', '300', '380', '688', '070'], // Montenegro, Macedonia del Norte, Grecia, Italia, Serbia, Bosnia
    neighbourNames: ['Kosovo'], // sin código ISO en Natural Earth
  },
};

const topo = await (await fetch(SOURCE)).json();
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

for (const [name, p] of Object.entries(PLANS)) {
  const cos = Math.cos((p.latRef * Math.PI) / 180);
  const W = (p.lon1 - p.lon0) * cos * p.k;
  const H = (p.lat1 - p.lat0) * p.k;
  const PAD = 40;
  const r1 = (n) => Math.round(n * 10) / 10;
  const proj = ([lon, lat]) => [(lon - p.lon0) * cos * p.k, (p.lat1 - lat) * p.k];

  const ringPath = (pts) => {
    const xy = [];
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
    return 'M' + xy.map(([x, y]) => `${x},${y}`).join('L') + 'Z';
  };

  const out = { W: r1(W), H: r1(H), main: '', neighbours: '' };
  for (const g of topo.objects.countries.geometries) {
    const isMain = g.id === p.main;
    const isNeighbour = p.neighbours.includes(g.id) || p.neighbourNames.includes(g.properties?.name);
    if (!isMain && !isNeighbour) continue;
    const polys = g.type === 'MultiPolygon' ? g.arcs : [g.arcs];
    const d = polys.flatMap((poly) => poly.map((ring) => ringPath(ringPoints(ring)))).join('');
    if (isMain) out.main = d; else out.neighbours += d;
  }

  await mkdir(new URL('../src/data/plans/', import.meta.url), { recursive: true });
  await writeFile(new URL('../' + p.out, import.meta.url), JSON.stringify(out));
  console.log(`${name}: ${p.out} (${out.W}×${out.H}, ${Math.round((out.main.length + out.neighbours.length) / 1024)} KB)`);
}
