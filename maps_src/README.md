# maps_src — mapas de Google My Maps

Coloca aquí los mapas exportados de **Google My Maps** para mostrarlos como rutas
interactivas en el portafolio.

## Cómo exportar desde Google My Maps

1. Abre tu mapa en [Google My Maps](https://www.google.com/mymaps).
2. Pulsa el menú **⋮** (junto al título del mapa) → **"Exportar a KML/KMZ"**.
3. Marca la casilla **"Exportar al formato KML en lugar de KMZ"**.
4. Descarga el archivo `.kml` y cópialo en esta carpeta (`maps_src/`).

> Si solo puedes descargar **KMZ**, ábrelo como `.zip` (renómbralo) y usa el
> `doc.kml` que contiene dentro.

## Convertir a GeoJSON

Desde la raíz del proyecto:

```bash
node scripts/kml-to-geojson.mjs
```

Esto genera un `.json` (GeoJSON) por cada `.kml` dentro de `src/data/trips/`.
El script te indicará en consola la línea exacta que debes añadir en
`src/data/trips.ts` para que la ruta aparezca en la web.

## Notas

- Los archivos `.kml` de esta carpeta **no** se incluyen en el sitio publicado;
  solo se usan como fuente para generar los GeoJSON.
- La ruta `budapest-ejemplo` que ya aparece en la web es solo una **muestra**
  para enseñar cómo se ven los mapas. Puedes borrarla cuando añadas las reales.
