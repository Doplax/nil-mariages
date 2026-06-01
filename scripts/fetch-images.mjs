// Script de un solo uso: obtiene imágenes representativas (lugares, no personas)
// de cada país a partir de un punto de referencia (landmark) usando la API de
// Wikipedia. Genera `src/data/images.json` con URLs estables de Wikimedia.
//
// Uso: node scripts/fetch-images.mjs
import { writeFileSync, readFileSync, existsSync } from 'node:fs';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Cada país apunta a un landmark/paisaje icónico para garantizar una imagen
// de LUGAR (no de personas).
const landmarks = {
  // Asia
  Kirguistán: 'Issyk-Kul',
  Tailandia: 'Wat Arun',
  Indonesia: 'Borobudur',
  Malasia: 'Kuala Lumpur',
  Nepal: 'Mount Everest',
  Laos: 'Luang Prabang',
  Camboya: 'Angkor Wat',
  Uzbekistán: 'Registan',
  Tayikistán: 'Pamir Mountains',
  Qatar: 'Doha',
  Singapur: 'Marina Bay Sands',
  Turquía: 'Cappadocia',
  // América
  Venezuela: 'Angel Falls',
  'Estados Unidos': 'Grand Canyon',
  // África
  Egipto: 'Giza pyramid complex',
  Marruecos: 'Chefchaouen',
  // Europa
  Albania: 'Gjirokastër',
  Serbia: 'Belgrade Fortress',
  Eslovaquia: 'Bratislava Castle',
  Austria: 'Hallstatt',
  Hungría: 'Hungarian Parliament Building',
  Suiza: 'Matterhorn',
  Alemania: 'Neuschwanstein Castle',
  Dinamarca: 'Nyhavn',
  Suecia: 'Gamla stan',
  Polonia: 'Wawel Castle',
  'República Checa': 'Charles Bridge',
  'Países Bajos': 'Amsterdam',
  Bulgaria: 'Rila Monastery',
  Portugal: 'Belém Tower',
  Italia: 'Colosseum',
  Francia: 'Eiffel Tower',
  Mónaco: 'Monte Carlo',
  Bélgica: 'Grand-Place',
  'Reino Unido': 'Tower Bridge',
  Irlanda: 'Cliffs of Moher',
  Andorra: 'Andorra la Vella',
  España: 'Sagrada Família',
  // Futuros proyectos
  Pakistán: 'Badshahi Mosque',
  China: 'Great Wall of China',
  Colombia: 'Cartagena, Colombia',
};

async function fetchImage(title, attempt = 1) {
  const url =
    'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages' +
    '&piprop=thumbnail&pithumbsize=1000&redirects=1&titles=' +
    encodeURIComponent(title);
  const res = await fetch(url, { headers: { 'User-Agent': 'nil-mariages-portfolio/1.0 (hola@nilmariages.com)' } });
  if (res.status === 429 && attempt <= 5) {
    const wait = 2000 * attempt;
    console.log(`   429 → reintentando en ${wait}ms (intento ${attempt})`);
    await sleep(wait);
    return fetchImage(title, attempt + 1);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const pages = data?.query?.pages ?? {};
  for (const page of Object.values(pages)) {
    if (page?.thumbnail?.source) return page.thumbnail.source;
  }
  return null;
}

// Reanudable: conserva las imágenes ya obtenidas en una ejecución anterior.
const outPath = new URL('../src/data/images.json', import.meta.url);
const result = existsSync(outPath) ? JSON.parse(readFileSync(outPath, 'utf8')) : {};
const missing = [];
for (const [country, title] of Object.entries(landmarks)) {
  if (result[country]) {
    console.log(`SKIP ${country.padEnd(18)} (ya guardada)`);
    continue;
  }
  try {
    const src = await fetchImage(title);
    if (src) {
      result[country] = src;
      console.log(`OK  ${country.padEnd(18)} ← ${title}`);
    } else {
      missing.push(country);
      console.log(`MISS ${country.padEnd(18)} ← ${title}`);
    }
  } catch (e) {
    missing.push(country);
    console.log(`ERR ${country.padEnd(18)} ← ${title} (${e.message})`);
  }
  // Guarda tras cada petición y espera para no saturar la API.
  writeFileSync(outPath, JSON.stringify(result, null, 2) + '\n');
  await sleep(1100);
}
console.log(`\nGuardadas ${Object.keys(result).length} imágenes. Faltan: ${missing.length ? missing.join(', ') : 'ninguna'}`);
