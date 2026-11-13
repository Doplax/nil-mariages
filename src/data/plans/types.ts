// Datos de una planificación interactiva (src/pages/planificaciones/*.astro).
// La maquetación del texto de cada día va en la página; aquí va lo que usan el
// mapa, la barra de días, los platos, la maleta y el conversor.

/** Cómo se hace un tramo: decide el trazo en el mapa y la leyenda. */
export type Mode = 'car' | 'transfer' | 'train' | 'ferry' | 'boatloop' | 'walk' | 'horse' | 'flight';

export interface PlanStop {
  name: string;
  lat: number;
  lon: number;
  /** Lado de la etiqueta en el mapa: izquierda, derecha, arriba o abajo */
  side: 'l' | 'r' | 't' | 'b';
  /** Se duerme allí (punto relleno y etiqueta siempre visible) */
  night?: boolean;
  /** Punto fuera del mapa (origen o destino de un vuelo): no se dibuja */
  off?: boolean;
  /** Si alguna parada lo lleva, en la vista general solo se rotulan estas */
  major?: boolean;
}

export interface PlanDay {
  n: number;
  /** Fecha corta para la barra de días: «4 sep» */
  date: string;
  /** Ruta del día para la cabecera del mapa */
  label: string;
  legs: [from: string, to: string, mode: Mode][];
  /** Paradas que se marcan aunque no haya tramos (días en una ciudad) */
  stops?: string[];
  /** Día que no está en el PDF: sale en la barra, pero sin mapa */
  missing?: boolean;
}

export interface PlanCurrency {
  code: string;
  /** Nombre corto en el conversor: «Lek», «Som»… */
  label: string;
  /** Símbolo para el resumen: «L», «KGS»… */
  symbol: string;
  /** Unidades por 1 €, el cambio que da la planificación */
  rate: number;
}

export interface PlanData {
  /** Clave para lo que se guarda en el navegador */
  id: string;
  stops: Record<string, PlanStop>;
  /** Rótulos del mapa: países y mares */
  labels: { text: string; lat: number; lon: number; anchor: 'start' | 'end'; kind: 'country' | 'sea' }[];
  days: PlanDay[];
  overview: { kicker: string; label: string };
  /** Vista general: todo el contorno (por defecto) o solo lo que abarca la ruta */
  overviewFit?: 'map' | 'stops';
  dishes: {
    cats: Record<string, string>;
    items: { cat: string; name: string; desc: string }[];
  };
  pack: { id: string; title: string; trip?: boolean; items: (string | [label: string, note: string])[] }[];
  currencies: PlanCurrency[];
  presets: { label: string; eur?: number; code?: string; amount?: number }[];
}

/** Contorno generado por scripts/build-plan-map.mjs */
export interface PlanMap {
  W: number;
  H: number;
  lon0: number;
  lat1: number;
  latRef: number;
  k: number;
  main: string;
  neighbours: string;
  /** Lagos de Natural Earth dentro del recuadro */
  lakes: string;
}
