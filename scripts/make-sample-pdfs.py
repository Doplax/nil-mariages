# -*- coding: utf-8 -*-
"""
Genera las versiones "muestra" (teaser) de las planificaciones para el visor web.

- Marca de agua diagonal persistente en TODAS las páginas:
  "NIL MARIAGES · MUESTRA PORTFOLIO · NO REPRODUCIR · 2025"
- Para Kirguistán/Uzbekistán: elimina el contenido de Turquía (Estambul) y
  Tayikistán (excursión Siete Lagos / Montes Fann) por petición del cliente:
    * Elimina las páginas del itinerario de Estambul y la excursión a Tayikistán.
    * Redacta (borra de verdad, no tapa) los bloques de Turquía en las páginas
      de información práctica que mezclan los tres países.

Salida: public/planificaciones/*.pdf

Uso:  python scripts/make-sample-pdfs.py
"""
import os
import fitz  # PyMuPDF

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public", "planificaciones")
os.makedirs(OUT_DIR, exist_ok=True)

WM_TEXT = "NIL MARIAGES  ·  MUESTRA PORTFOLIO  ·  NO REPRODUCIR  ·  2025"


def add_watermark(page):
    """Marca de agua diagonal repetida en mosaico, gris claro y translúcida."""
    rect = page.rect
    tw = fitz.TextWriter(rect)
    fontsize = 15
    color = (0.55, 0.58, 0.62)
    # Mosaico diagonal: varias filas desplazadas que cubren toda la página.
    step_y = 150
    y = -40
    row = 0
    while y < rect.height + 120:
        x = -120 + (60 if row % 2 else 0)
        while x < rect.width + 60:
            tw.append((x, y), WM_TEXT, fontsize=fontsize)
            x += 430
        y += step_y
        row += 1
    pivot = fitz.Point(rect.width / 2, rect.height / 2)
    mat = fitz.Matrix(1, 1).prerotate(-30)
    tw.write_text(page, color=color, opacity=0.13, morph=(pivot, mat))


def redact(page, rects):
    for r in rects:
        page.add_redact_annot(fitz.Rect(*r), fill=(1, 1, 1))
    # Mantiene las imágenes; solo borra texto/vectores dentro del rect.
    page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE)


def build_albania():
    src = os.path.join(ROOT, "planning-src", "albania.pdf")
    doc = fitz.open(src)
    for page in doc:
        add_watermark(page)
    out = os.path.join(OUT_DIR, "albania-muestra.pdf")
    doc.save(out, garbage=4, deflate=True)
    doc.close()
    print(f"OK  {out}  ({os.path.getsize(out)//1024} KB)")


def build_kgz_uzb():
    src = os.path.join(ROOT, "planning-src", "kirguistan-uzbekistan.pdf")
    doc = fitz.open(src)

    # 1) Redacción de los bloques de Turquía en páginas de info mixta (idx 0-based).
    #    Coordenadas obtenidas con page.search_for() sobre el documento original.
    redact(doc[1], [(48, 330, 548, 410)])                       # P2 requisitos: bloque TURQUÍA
    redact(doc[2], [(78, 216, 522, 240), (78, 322, 522, 346)])  # P3 enlaces: link TURQUÍA + TAJIKISTÁN
    redact(doc[3], [
        (133, 142, 179, 159),   # P4 intro: palabra "Turquía," (sin tocar "Kirguistán")
        (60, 284, 548, 308),    # P4: línea "-En Estambul, Turkcell..."
        (314, 449, 380, 470),   # P4 frase MAPAS: palabra "Estambul"
        (93, 763, 170, 786),    # P4: maplink "ESTAMBUL"
    ])
    redact(doc[4], [(50, 150, 548, 373)])                       # P5 datos prácticos: bloque TURQUÍA
    redact(doc[5], [(50, 140, 548, 625)])                       # P6 consejos: bloque TURQUÍA
    redact(doc[7], [(50, 138, 548, 348)])                       # P8 comida típica: bloque TURQUÍA

    # 2) Eliminar páginas dedicadas a Turquía y Tayikistán (1-based -> 0-based).
    #    P9-P33 = itinerario de Estambul; P89 = excursión Siete Lagos (Tayikistán).
    istanbul = list(range(8, 33))   # idx 8..32  (P9..P33)
    tajik = [88]                    # idx 88     (P89)
    for idx in sorted(istanbul + tajik, reverse=True):
        doc.delete_page(idx)

    # 3) Marca de agua en todas las páginas restantes.
    for page in doc:
        add_watermark(page)

    out = os.path.join(OUT_DIR, "kirguistan-uzbekistan-muestra.pdf")
    doc.save(out, garbage=4, deflate=True)
    print(f"OK  {out}  ({os.path.getsize(out)//1024} KB)  páginas: {doc.page_count}")
    doc.close()


if __name__ == "__main__":
    build_albania()
    build_kgz_uzb()
