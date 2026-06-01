// Datos de la experiencia viajera de Nil Mariages.
// Las descripciones están redactadas para dar contexto rápido de cada destino.
// Las imágenes se sirven desde LoremFlickr (fotos con licencia Creative Commons),
// usando `lock` para que cada país muestre siempre la misma imagen.
// El campo `imageQuery` se puede sustituir fácilmente por una URL propia si se desea.

export interface Country {
  /** Nombre del país en español */
  name: string;
  /** Emoji de la bandera */
  flag: string;
  /** Descripción breve del destino */
  description: string;
  /** Palabra clave usada para obtener una imagen representativa */
  imageQuery: string;
}

export interface Region {
  id: string;
  title: string;
  emoji: string;
  subtitle?: string;
  /** Las regiones destacadas (internacional) reciben más protagonismo en la UI */
  featured: boolean;
  countries: Country[];
}

let lockCounter = 1;

/** Construye una URL de imagen estable y representativa para un país */
export function countryImage(query: string, width = 600, height = 450): string {
  const lock = lockCounter++;
  return `https://loremflickr.com/${width}/${height}/${encodeURIComponent(query)}?lock=${lock}`;
}

export const regions: Region[] = [
  {
    id: 'asia',
    title: 'Asia',
    emoji: '🌏',
    subtitle: 'Mi continente favorito',
    featured: true,
    countries: [
      { name: 'Kirguistán', flag: '🇰🇬', imageQuery: 'kyrgyzstan,mountains', description: 'Montañas del Tien Shan, lagos alpinos y la vida nómada del Asia Central en estado puro.' },
      { name: 'Tailandia', flag: '🇹🇭', imageQuery: 'thailand,temple', description: 'Templos dorados, playas de postal y una gastronomía callejera que enamora.' },
      { name: 'Indonesia', flag: '🇮🇩', imageQuery: 'indonesia,bali', description: 'Más de 17.000 islas: volcanes, arrozales de Bali y fondos marinos espectaculares.' },
      { name: 'Malasia', flag: '🇲🇾', imageQuery: 'malaysia,kualalumpur', description: 'Mezcla vibrante de culturas, selva tropical y los rascacielos de Kuala Lumpur.' },
      { name: 'Nepal', flag: '🇳🇵', imageQuery: 'nepal,himalaya', description: 'El techo del mundo: el Himalaya, Katmandú y rutas de trekking legendarias.' },
      { name: 'Laos', flag: '🇱🇦', imageQuery: 'laos,mekong', description: 'Ritmo pausado, templos budistas y los paisajes fluviales del Mekong.' },
      { name: 'Camboya', flag: '🇰🇭', imageQuery: 'cambodia,angkor', description: 'El majestuoso Angkor Wat y la calidez de un pueblo lleno de historia.' },
      { name: 'Uzbekistán', flag: '🇺🇿', imageQuery: 'uzbekistan,samarkand', description: 'Ciudades de la Ruta de la Seda como Samarcanda y Bujará, joyas de azulejos.' },
      { name: 'Tayikistán', flag: '🇹🇯', imageQuery: 'tajikistan,pamir', description: 'El Pamir, una de las carreteras de montaña más remotas y bellas del planeta.' },
      { name: 'Qatar', flag: '🇶🇦', imageQuery: 'doha,qatar', description: 'Modernidad del desierto: Doha, dunas doradas y lujo a orillas del Golfo.' },
      { name: 'Singapur', flag: '🇸🇬', imageQuery: 'singapore', description: 'Ciudad-jardín futurista donde conviven naturaleza, tecnología y sabores asiáticos.' },
      { name: 'Turquía', flag: '🇹🇷', imageQuery: 'istanbul,cappadocia', description: 'Puente entre Europa y Asia: Estambul, Capadocia y una hospitalidad inolvidable.' },
    ],
  },
  {
    id: 'america',
    title: 'América',
    emoji: '🌎',
    featured: true,
    countries: [
      { name: 'Venezuela', flag: '🇻🇪', imageQuery: 'venezuela,caribbean', description: 'Del Caribe al Salto Ángel, naturaleza desbordante y gente acogedora.' },
      { name: 'Estados Unidos', flag: '🇺🇸', imageQuery: 'grandcanyon,usa', description: 'Grandes parques nacionales, ciudades icónicas y carreteras infinitas.' },
    ],
  },
  {
    id: 'africa',
    title: 'África',
    emoji: '🌍',
    featured: true,
    countries: [
      { name: 'Egipto', flag: '🇪🇬', imageQuery: 'pyramids,egypt', description: 'Pirámides milenarias, el Nilo eterno y los tesoros de los faraones.' },
      { name: 'Marruecos', flag: '🇲🇦', imageQuery: 'morocco,marrakech', description: 'Zocos, desierto del Sáhara y ciudades imperiales llenas de color.' },
    ],
  },
  {
    id: 'europa',
    title: 'Europa',
    emoji: '🇪🇺',
    subtitle: 'Recorrida a fondo, mapa a mapa',
    featured: false,
    countries: [
      { name: 'Albania', flag: '🇦🇱', imageQuery: 'albania,beach', description: 'Costa jónica virgen, montañas y un país auténtico por descubrir.' },
      { name: 'Serbia', flag: '🇷🇸', imageQuery: 'belgrade,serbia', description: 'Belgrado vibrante, historia balcánica y hospitalidad sincera.' },
      { name: 'Eslovaquia', flag: '🇸🇰', imageQuery: 'slovakia,bratislava', description: 'Castillos, los Altos Tatras y un encanto centroeuropeo discreto.' },
      { name: 'Austria', flag: '🇦🇹', imageQuery: 'vienna,austria', description: 'Alpes, palacios imperiales y la elegancia musical de Viena.' },
      { name: 'Hungría', flag: '🇭🇺', imageQuery: 'budapest', description: 'Budapest a orillas del Danubio, balnearios termales e historia.' },
      { name: 'Suiza', flag: '🇨🇭', imageQuery: 'switzerland,alps', description: 'Montañas perfectas, lagos cristalinos y pueblos de cuento.' },
      { name: 'Alemania', flag: '🇩🇪', imageQuery: 'germany,berlin', description: 'Bosques, ciudades dinámicas y una mezcla de tradición y modernidad.' },
      { name: 'Dinamarca', flag: '🇩🇰', imageQuery: 'copenhagen,denmark', description: 'Diseño, ciclismo y el espíritu "hygge" de Copenhague.' },
      { name: 'Suecia', flag: '🇸🇪', imageQuery: 'stockholm,sweden', description: 'Naturaleza nórdica, archipiélagos y ciudades de estilo impecable.' },
      { name: 'Polonia', flag: '🇵🇱', imageQuery: 'poland,krakow', description: 'Historia intensa, ciudades medievales y una cocina reconfortante.' },
      { name: 'República Checa', flag: '🇨🇿', imageQuery: 'prague', description: 'Praga de cuento, castillos y la mejor tradición cervecera.' },
      { name: 'Países Bajos', flag: '🇳🇱', imageQuery: 'amsterdam,netherlands', description: 'Canales, bicicletas y el arte y la luz de Ámsterdam.' },
      { name: 'Bulgaria', flag: '🇧🇬', imageQuery: 'bulgaria,sofia', description: 'Monasterios, costa del Mar Negro y montañas poco transitadas.' },
      { name: 'Portugal', flag: '🇵🇹', imageQuery: 'lisbon,portugal', description: 'Atlántico, fado, azulejos y una luz que enamora.' },
      { name: 'Italia', flag: '🇮🇹', imageQuery: 'italy,rome', description: 'Arte, gastronomía y paisajes que van de los Alpes al Mediterráneo.' },
      { name: 'Francia', flag: '🇫🇷', imageQuery: 'paris,france', description: 'París, viñedos, castillos y una riqueza cultural inagotable.' },
      { name: 'Mónaco', flag: '🇲🇨', imageQuery: 'monaco,montecarlo', description: 'Glamur mediterráneo en el principado más exclusivo de Europa.' },
      { name: 'Bélgica', flag: '🇧🇪', imageQuery: 'brussels,belgium', description: 'Ciudades medievales, chocolate, cerveza y un corazón europeo.' },
      { name: 'Reino Unido', flag: '🇬🇧', imageQuery: 'london', description: 'Londres cosmopolita, campiña verde y castillos cargados de historia.' },
      { name: 'Irlanda', flag: '🇮🇪', imageQuery: 'ireland,cliffs', description: 'Acantilados, prados esmeralda y la calidez de sus pubs.' },
      { name: 'Andorra', flag: '🇦🇩', imageQuery: 'andorra,pyrenees', description: 'Pirineos, esquí y naturaleza entre Francia y España.' },
      { name: 'España', flag: '🇪🇸', imageQuery: 'spain,barcelona', description: 'Hogar y base: sol, cultura, gastronomía y diversidad de paisajes.' },
    ],
  },
];

export interface FutureProject {
  name: string;
  flag: string;
  description: string;
  imageQuery: string;
}

export const futureProjects: FutureProject[] = [
  { name: 'Pakistán', flag: '🇵🇰', imageQuery: 'pakistan,karakoram', description: 'El Karakórum y algunas de las montañas más altas y salvajes del mundo.' },
  { name: 'China', flag: '🇨🇳', imageQuery: 'china,greatwall', description: 'Milenaria y colosal: de la Gran Muralla a megaciudades futuristas.' },
  { name: 'Colombia', flag: '🇨🇴', imageQuery: 'colombia,cartagena', description: 'Caribe, café, selva amazónica y la energía contagiosa de su gente.' },
];

/** Total de países visitados (para mostrar como estadística) */
export const totalCountries = regions.reduce((acc, r) => acc + r.countries.length, 0);
