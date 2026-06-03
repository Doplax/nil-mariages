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
>
> ⚠️ **Ojo:** el KMZ de Google My Maps a veces no lleva los datos dentro, sino un
> `NetworkLink` que apunta al mapa online. En ese caso el `doc.kml` solo tiene una
> URL con un `mid=...`. Para obtener el KML real con todos los puntos y recorridos,
> descárgalo así (sustituye el `mid`):
>
> ```bash
> curl -L "https://www.google.com/maps/d/kml?mid=TU_MID&forcekml=1" -o maps_src/mapa.kml
> ```

## Caso especial: Kirguistán

La ruta de Kirguistán (`maps_src/kyrgyzstan.kml`) viene de un mapa rico (169
elementos: recorridos, POIs y gasolineras). Su GeoJSON **curado y simplificado**
se genera con un script propio que se queda con las rutas y los lugares destacados
y descarta el ruido (gasolineras, waypoints duplicados):

```bash
node scripts/build-kyrgyzstan-map.mjs
```

El mapa **completo** se muestra además en la web como embed interactivo de Google
My Maps (campo `embedSrc` en `src/data/trips.ts`).

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
