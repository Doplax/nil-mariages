// Datos de la experiencia viajera de Nil Mariages.
// Las descripciones están redactadas para dar contexto rápido de cada destino.
// Las imágenes son fotografías reales de lugares emblemáticos obtenidas de
// Wikimedia Commons (ver `images.json`, generado con `scripts/fetch-images.mjs`).
// Las banderas se sirven como imagen desde flagcdn.com (se ven en cualquier
// sistema, a diferencia de los emojis de bandera).

import images from './images.json';

const countryImages: Record<string, string> = images;

export interface Country {
  /** Nombre del país en español */
  name: string;
  /** Código ISO 3166-1 alpha-2 en minúsculas (para la bandera) */
  iso: string;
  /** Descripción breve del destino */
  description: string;
}

export interface Region {
  id: string;
  title: string;
  icon: string;
  subtitle?: string;
  /** Las regiones destacadas (internacional) reciben más protagonismo en la UI */
  featured: boolean;
  countries: Country[];
}

/** URL de la imagen del país (foto real del lugar) */
export function countryImage(name: string): string {
  return countryImages[name] ?? `https://loremflickr.com/600/450/${encodeURIComponent(name)}`;
}

/** URL de la bandera del país */
export function flagUrl(iso: string, width = 80): string {
  return `https://flagcdn.com/w${width}/${iso}.png`;
}

export const regions: Region[] = [
  {
    id: 'asia',
    title: 'Asia',
    icon: '🌏',
    subtitle: 'Mi continente favorito',
    featured: true,
    countries: [
      { name: 'Kirguistán', iso: 'kg', description: 'Montañas del Tien Shan, lagos alpinos y la vida nómada del Asia Central en estado puro.' },
      { name: 'Tailandia', iso: 'th', description: 'Templos dorados, playas de postal y una gastronomía callejera que enamora.' },
      { name: 'Indonesia', iso: 'id', description: 'Más de 17.000 islas: volcanes, arrozales de Bali y fondos marinos espectaculares.' },
      { name: 'Malasia', iso: 'my', description: 'Mezcla vibrante de culturas, selva tropical y los rascacielos de Kuala Lumpur.' },
      { name: 'Nepal', iso: 'np', description: 'El techo del mundo: el Himalaya, Katmandú y rutas de trekking legendarias.' },
      { name: 'Laos', iso: 'la', description: 'Ritmo pausado, templos budistas y los paisajes fluviales del Mekong.' },
      { name: 'Camboya', iso: 'kh', description: 'El majestuoso Angkor Wat y la calidez de un pueblo lleno de historia.' },
      { name: 'Uzbekistán', iso: 'uz', description: 'Ciudades de la Ruta de la Seda como Samarcanda y Bujará, joyas de azulejos.' },
      { name: 'Tayikistán', iso: 'tj', description: 'El Pamir, una de las carreteras de montaña más remotas y bellas del planeta.' },
      { name: 'Qatar', iso: 'qa', description: 'Modernidad del desierto: Doha, dunas doradas y lujo a orillas del Golfo.' },
      { name: 'Singapur', iso: 'sg', description: 'Ciudad-jardín futurista donde conviven naturaleza, tecnología y sabores asiáticos.' },
      { name: 'Turquía', iso: 'tr', description: 'Puente entre Europa y Asia: Estambul, Capadocia y una hospitalidad inolvidable.' },
    ],
  },
  {
    id: 'america',
    title: 'América',
    icon: '🌎',
    featured: true,
    countries: [
      { name: 'Venezuela', iso: 've', description: 'Del Caribe al Salto Ángel, naturaleza desbordante y gente acogedora.' },
      { name: 'Estados Unidos', iso: 'us', description: 'Grandes parques nacionales, ciudades icónicas y carreteras infinitas.' },
    ],
  },
  {
    id: 'africa',
    title: 'África',
    icon: '🌍',
    featured: true,
    countries: [
      { name: 'Egipto', iso: 'eg', description: 'Pirámides milenarias, el Nilo eterno y los tesoros de los faraones.' },
      { name: 'Marruecos', iso: 'ma', description: 'Zocos, desierto del Sáhara y ciudades imperiales llenas de color.' },
    ],
  },
  {
    id: 'europa',
    title: 'Europa',
    icon: '🏰',
    subtitle: 'Recorrida a fondo, mapa a mapa',
    featured: false,
    countries: [
      { name: 'Albania', iso: 'al', description: 'Costa jónica virgen, montañas y un país auténtico por descubrir.' },
      { name: 'Serbia', iso: 'rs', description: 'Belgrado vibrante, historia balcánica y hospitalidad sincera.' },
      { name: 'Eslovaquia', iso: 'sk', description: 'Castillos, los Altos Tatras y un encanto centroeuropeo discreto.' },
      { name: 'Austria', iso: 'at', description: 'Alpes, palacios imperiales y la elegancia musical de Viena.' },
      { name: 'Hungría', iso: 'hu', description: 'Budapest a orillas del Danubio, balnearios termales e historia.' },
      { name: 'Suiza', iso: 'ch', description: 'Montañas perfectas, lagos cristalinos y pueblos de cuento.' },
      { name: 'Alemania', iso: 'de', description: 'Bosques, ciudades dinámicas y una mezcla de tradición y modernidad.' },
      { name: 'Dinamarca', iso: 'dk', description: 'Diseño, ciclismo y el espíritu "hygge" de Copenhague.' },
      { name: 'Suecia', iso: 'se', description: 'Naturaleza nórdica, archipiélagos y ciudades de estilo impecable.' },
      { name: 'Polonia', iso: 'pl', description: 'Historia intensa, ciudades medievales y una cocina reconfortante.' },
      { name: 'República Checa', iso: 'cz', description: 'Praga de cuento, castillos y la mejor tradición cervecera.' },
      { name: 'Países Bajos', iso: 'nl', description: 'Canales, bicicletas y el arte y la luz de Ámsterdam.' },
      { name: 'Bulgaria', iso: 'bg', description: 'Monasterios, costa del Mar Negro y montañas poco transitadas.' },
      { name: 'Portugal', iso: 'pt', description: 'Atlántico, fado, azulejos y una luz que enamora.' },
      { name: 'Italia', iso: 'it', description: 'Arte, gastronomía y paisajes que van de los Alpes al Mediterráneo.' },
      { name: 'Francia', iso: 'fr', description: 'París, viñedos, castillos y una riqueza cultural inagotable.' },
      { name: 'Mónaco', iso: 'mc', description: 'Glamur mediterráneo en el principado más exclusivo de Europa.' },
      { name: 'Bélgica', iso: 'be', description: 'Ciudades medievales, chocolate, cerveza y un corazón europeo.' },
      { name: 'Reino Unido', iso: 'gb', description: 'Londres cosmopolita, campiña verde y castillos cargados de historia.' },
      { name: 'Irlanda', iso: 'ie', description: 'Acantilados, prados esmeralda y la calidez de sus pubs.' },
      { name: 'Andorra', iso: 'ad', description: 'Pirineos, esquí y naturaleza entre Francia y España.' },
      { name: 'España', iso: 'es', description: 'Hogar y base: sol, cultura, gastronomía y diversidad de paisajes.' },
    ],
  },
];

export interface FutureProject {
  name: string;
  iso: string;
  description: string;
}

export const futureProjects: FutureProject[] = [
  { name: 'Pakistán', iso: 'pk', description: 'El Karakórum y algunas de las montañas más altas y salvajes del mundo.' },
  { name: 'China', iso: 'cn', description: 'Milenaria y colosal: de la Gran Muralla a megaciudades futuristas.' },
  { name: 'Colombia', iso: 'co', description: 'Caribe, café, selva amazónica y la energía contagiosa de su gente.' },
];

/** Total de países visitados (para mostrar como estadística) */
export const totalCountries = regions.reduce((acc, r) => acc + r.countries.length, 0);
