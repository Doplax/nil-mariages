// Versión pequeña (480 px) de las fotos de una planificación interactiva y
// lista de medidas para el srcset de PlanPhoto.astro.
//
//   node scripts/plan-images.mjs albania
//
// Lee public/images/planificaciones/<plan>/*.webp (las grandes, 1200 px como
// mucho y calidad 74, ver CLAUDE.md), crea <nombre>-480.webp al lado y escribe
// src/data/plans/<plan>-images.json con el ancho y el alto de cada una.
import { readdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const plan = process.argv[2];
if (!plan) {
  console.error('Uso: node scripts/plan-images.mjs <plan>');
  process.exit(1);
}
const dir = `public/images/planificaciones/${plan}/`;
const files = (await readdir(dir)).filter((f) => f.endsWith('.webp') && !f.endsWith('-480.webp')).sort();
const sizes = {};
for (const f of files) {
  const name = f.replace(/\.webp$/, '');
  const { width, height } = await sharp(dir + f).metadata();
  sizes[name] = { w: width, h: height, small: width > 560 };
  if (width > 560) {
    await sharp(dir + f).resize({ width: 480 }).webp({ quality: 74, effort: 6 }).toFile(`${dir}${name}-480.webp`);
  }
}
await writeFile(`src/data/plans/${plan}-images.json`, JSON.stringify(sizes, null, 1) + '\n');
console.log(`${plan}: ${files.length} fotos, ${Object.values(sizes).filter((s) => s.small).length} con versión de 480 px`);
