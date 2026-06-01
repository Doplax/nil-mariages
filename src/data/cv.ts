// Datos del currículum de Nil Mariages (extraídos de su CV en PDF).
// Se muestran estructurados directamente en la web; el PDF también es descargable.

export const profile = {
  name: 'Nil Mariages',
  role: 'Agente de viajes y guía titulado',
  email: 'nil.mariages@gmail.com',
  phone: '+34 638 35 30 20',
  phoneHref: 'tel:+34638353020',
  whatsapp: 'https://wa.me/34638353020',
  location: 'Barcelona',
  cvFile: '/CV-Nil-Mariages.pdf',
  summary:
    'Agente de viajes especializado en el diseño y venta de viajes a medida, con experiencia en asesoramiento personalizado, gestión de reservas y acompañamiento integral al cliente antes, durante y después del viaje. Apasionado por el turismo de aventura y la creación de itinerarios adaptados a las necesidades de cada viajero. He visitado más de 40 países en Europa, Asia, África y América, lo que me permite aportar un conocimiento práctico de destinos, culturas y experiencias para ofrecer recomendaciones auténticas y diferenciadas. Orientado a proporcionar un servicio cercano, profesional y enfocado en crear experiencias memorables.',
};

export interface ExperienceItem {
  role: string;
  company: string;
  type: string;
  period: string;
  summary: string;
  bullets: string[];
}

export const experience: ExperienceItem[] = [
  {
    role: 'Agente de viajes',
    company: 'Wakea Travel España',
    type: 'Jornada completa',
    period: 'mar. 2023 — ene. 2026',
    summary:
      'Atención y asesoramiento al cliente, preparación de presupuestos y gestión de reservas, organizando viajes a medida según las necesidades de cada viajero. También resolución de incidencias y acompañamiento al cliente durante todo el proceso de planificación y viaje.',
    bullets: [
      'Diseño y venta de viajes personalizados adaptados a las necesidades de cada cliente.',
      'Elaboración de presupuestos y seguimiento comercial.',
      'Gestión de reservas de vuelos, alojamientos y servicios a través de canales de reservas y plataformas B2B.',
      'Resolución de incidencias antes y durante el viaje.',
      'Asesoramiento sobre documentación, requisitos de entrada y recomendaciones de destino.',
      'Atención al cliente multicanal (teléfono, email y presencial).',
      'Gestión de múltiples expedientes simultáneamente.',
    ],
  },
  {
    role: 'Reponedor',
    company: 'Bon Preu S.A.U.',
    type: 'Jornada parcial',
    period: 'sept. 2021 — mar. 2023',
    summary:
      'Tareas de reposición, control de stock y mantenimiento del orden en tienda, además de atención al cliente. Una experiencia útil para desarrollar rapidez, organización y trato directo con el público mientras completaba mis estudios.',
    bullets: [
      'Atención al cliente en tienda y apoyo en la resolución de dudas o incidencias.',
      'Reposición de productos y mantenimiento del orden en el punto de venta.',
      'Control de stock, inventario básico y organización del área de trabajo.',
      'Cumplimiento de procedimientos internos y apoyo al buen funcionamiento del equipo.',
    ],
  },
];

export interface EducationItem {
  title: string;
  place: string;
  period: string;
}

export const education: EducationItem[] = [
  {
    title: 'Grado en Geografía',
    place: 'Universitat de Barcelona',
    period: '2021 — 2025',
  },
  {
    title: 'CFGS en Guía, Información y Asistencia Turística',
    place: "Escola d'Hostaleria i Turisme de Barcelona",
    period: '2019 — 2021',
  },
];

export const skills: string[] = [
  'Diseño de viajes a medida',
  'Venta consultiva',
  'Atención al cliente',
  'Gestión de incidencias',
  'Negociación con proveedores',
  'Organización y planificación',
  'Conocimiento de destinos internacionales',
];

export interface Language {
  name: string;
  level: string;
  /** Nivel 0-5 para la barra visual */
  value: number;
}

export const languages: Language[] = [
  { name: 'Catalán', level: 'Nativo', value: 5 },
  { name: 'Español', level: 'Nativo', value: 5 },
  { name: 'Inglés', level: 'Avanzado (C1)', value: 4 },
  { name: 'Francés', level: 'Muy básico', value: 1 },
];

export const awards: string[] = ['Primer puesto en la X Olimpiada de Geografía de Barcelona.'];

export const interests: string[] = [
  'Carnet de conducir B y vehículo propio.',
  'Disponibilidad para viajar.',
];
