// Estructura de la experiencia viajera (qué países, en qué continente y orden).
// El TEXTO (nombres y descripciones) vive en los diccionarios de i18n
// (`src/i18n/*`), indexado por código ISO. Las imágenes son fotos reales de
// lugares emblemáticos (Wikimedia Commons), también indexadas por ISO.

import images from './images.json';

const countryImages: Record<string, string> = images;

export interface RegionStruct {
  id: string;
  /** Emoji decorativo del continente */
  icon: string;
  /** Las regiones destacadas (internacional) reciben más protagonismo */
  featured: boolean;
  /** Códigos ISO de los países, en orden */
  countries: string[];
}

export const regions: RegionStruct[] = [
  { id: 'asia', icon: '🌏', featured: true, countries: ['kg', 'th', 'id', 'my', 'np', 'la', 'kh', 'uz', 'tj', 'qa', 'sg', 'tr'] },
  { id: 'america', icon: '🌎', featured: true, countries: ['ve', 'us'] },
  { id: 'africa', icon: '🌍', featured: true, countries: ['eg', 'ma'] },
  {
    id: 'europa',
    icon: '🌍',
    featured: false,
    countries: ['al', 'rs', 'sk', 'at', 'hu', 'ch', 'de', 'dk', 'se', 'pl', 'cz', 'nl', 'bg', 'pt', 'it', 'fr', 'mc', 'be', 'gb', 'ie', 'ad', 'es'],
  },
];

export const futureProjects: string[] = ['pk', 'cn', 'co'];

/** URL de la imagen del país (foto real del lugar), indexada por ISO. */
export function countryImage(iso: string): string {
  return countryImages[iso] ?? `https://loremflickr.com/600/450/${iso}`;
}

/** Total de países visitados (para mostrar como estadística). */
export const totalCountries = regions.reduce((acc, r) => acc + r.countries.length, 0);
