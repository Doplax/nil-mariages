import type { Dict, Lang } from './types';
import { es } from './es';
import { en } from './en';
import { ca } from './ca';

export { LANGS, DEFAULT_LANG, LANG_NAMES } from './types';
export type { Dict, Lang } from './types';

export const dictionaries: Record<Lang, Dict> = { es, en, ca };

/** Devuelve el diccionario del idioma indicado (es por defecto). */
export function getDict(lang: Lang): Dict {
  return dictionaries[lang] ?? es;
}

/** URL base de cada idioma (es es la raíz; en y ca con prefijo). */
export function localeUrl(lang: Lang): string {
  return lang === 'es' ? '/' : `/${lang}/`;
}

/** Detecta el idioma a partir de la URL (/en/… o /ca/… → en/ca, resto → es). */
export function getLangFromUrl(url: URL): Lang {
  const [, seg] = url.pathname.split('/');
  if (seg === 'en' || seg === 'ca') return seg;
  return 'es';
}

/** Sustituye {count} (y similares) en una cadena del diccionario. */
export function interpolate(text: string, vars: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}
