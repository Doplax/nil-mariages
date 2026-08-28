// Los iconos decorativos salen de Font Awesome Free (solid). No se carga la
// fuente ni el runtime de la librería: solo se importa la definición del
// icono, que es el `path` en crudo, y se dibuja como SVG inline. Así no hay
// petición extra ni FOUC, y el icono hereda el color del texto.
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

/** Geometría del icono a la altura pedida. El ancho sale de su propio ratio. */
export function iconParts(icon: IconDefinition, size: number) {
  const [w, h, , , d] = icon.icon;
  return {
    viewBox: `0 0 ${w} ${h}`,
    path: Array.isArray(d) ? d.join(' ') : d,
    width: Math.round((size * w) / h),
    height: size,
  };
}

/**
 * El mismo SVG, pero como cadena. Para los sitios donde no cabe el componente
 * `Icon.astro`: un script de cliente que lo inyecta con innerHTML.
 */
export function iconSvg(icon: IconDefinition, size = 20, cls = ''): string {
  const { viewBox, path, width, height } = iconParts(icon, size);
  const classAttr = cls ? ` class="${cls}"` : '';
  return `<svg${classAttr} width="${width}" height="${height}" viewBox="${viewBox}" fill="currentColor" aria-hidden="true" focusable="false"><path d="${path}"/></svg>`;
}
