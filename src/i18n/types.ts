// Tipos del sistema de internacionalización (i18n).
// Todo el texto traducible vive en diccionarios `Dict` (uno por idioma).

export type Lang = 'es' | 'en' | 'ca';

export const LANGS: Lang[] = ['es', 'en', 'ca'];
export const DEFAULT_LANG: Lang = 'es';

export const LANG_NAMES: Record<Lang, string> = {
  es: 'Español',
  en: 'English',
  ca: 'Català',
};

export interface CountryText {
  name: string;
  desc: string;
}

export interface RegionText {
  title: string;
  subtitle?: string;
}

export interface CvExperience {
  role: string;
  company: string;
  type: string;
  period: string;
  summary: string;
  bullets: string[];
}

export interface CvEducation {
  title: string;
  place: string;
  period: string;
}

export interface CvLanguage {
  name: string;
  level: string;
  value: number;
}

export interface TripText {
  title: string;
  location: string;
  description: string;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  country: string;
  stars?: number;
  source?: string;
}

export interface PlanningDay {
  label: string;
  text: string;
}

export interface PlanningItem {
  title: string;
  location: string;
  duration: string;
  type: string;
  image: string;
  isos: string[];
  summary: string;
  days: PlanningDay[];
}

export interface Dict {
  ui: {
    nav: { about: string; trayectoria: string; viajes: string; rutas: string; contacto: string };
    hero: {
      tag: string;
      titleTop: string;
      titleAccent: string;
      lead: string;
      ctaPrimary: string;
      ctaGhost: string;
      statCountries: string;
      statContinents: string;
      statTailored: string;
    };
    about: {
      eyebrow: string;
      title: string;
      p1: string;
      p2: string;
      role: string;
      cards: { title: string; text: string }[];
    };
    resume: {
      eyebrow: string;
      title: string;
      lead: string;
      download: string;
      expTitle: string;
      eduTitle: string;
      langTitle: string;
      skillsTitle: string;
      awardsTitle: string;
      interestsTitle: string;
      licensesTitle: string;
    };
    experience: { eyebrow: string; title: string; lead: string; countriesLabel: string };
    trips: { eyebrow: string; title: string; lead: string; sampleBadge: string };
    future: { eyebrow: string; title: string; lead: string; soon: string };
    cta: { title: string; text: string; email: string; whatsapp: string };
    testimonials: {
      eyebrow: string;
      title: string;
      lead: string;
      items: Testimonial[];
    };
    contact: {
      eyebrow: string;
      title: string;
      lead: string;
      namePlaceholder: string;
      emailPlaceholder: string;
      msgPlaceholder: string;
      submit: string;
      success: string;
      privacy: string;
    };
    planning: {
      eyebrow: string;
      title: string;
      lead: string;
      showDays: string;
      hideDays: string;
      items: PlanningItem[];
    };
    footer: { tagline: string; navTitle: string; contactTitle: string; madeWith: string };
    langLabel: string;
  };
  countries: Record<string, CountryText>;
  regions: Record<string, RegionText>;
  future: Record<string, CountryText>;
  cv: {
    summary: string;
    experience: CvExperience[];
    education: CvEducation[];
    skills: string[];
    languages: CvLanguage[];
    awards: string[];
    interests: string[];
    licenses: string[];
  };
  trips: Record<string, TripText>;
}
