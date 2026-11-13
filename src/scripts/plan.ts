// Comportamiento de una planificación interactiva (PlanLayout.astro): mapa que
// sigue el día que se lee, barra de días, lugares que se tocan, hoja del mapa
// en el móvil, pestañas, conversor, platos, maleta y visor de fotos.
// Los datos vienen de src/data/plans/<plan>.ts; la proyección del mapa, del
// atributo data-proj del <svg> (la escribe scripts/build-plan-map.mjs).
import type { PlanData } from '../data/plans/types';

export function initPlan(plan: PlanData) {
  const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector(s) as T;
  const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll(s)) as T[];
  const store = {
    get<T>(k: string, d: T): T { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } },
  };
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileMQ = matchMedia('(max-width: 999px)');
  const NS = 'http://www.w3.org/2000/svg';

  /* Altura de la cabecera fija */
  const topEl = $('#top');
  const setHH = () => document.documentElement.style.setProperty('--hh', topEl.offsetHeight + 'px');
  setHH();
  if ('ResizeObserver' in window) new ResizeObserver(setHH).observe(topEl);

  /* Proyección */
  const svg = $<SVGSVGElement>('#map-svg');
  const P = JSON.parse(svg.dataset.proj || '{}') as { W: number; H: number; lon0: number; lat1: number; latRef: number; k: number };
  const COS = Math.cos((P.latRef * Math.PI) / 180);
  const proj = (lat: number, lon: number): [number, number] => [(lon - P.lon0) * COS * P.k, (P.lat1 - lat) * P.k];
  const U = P.k / 200; // las medidas de abajo se pensaron con k = 200 (Albania)

  type Stop = { key: string; name: string; xy: [number, number]; side: 'l' | 'r' | 't' | 'b'; night: boolean; off: boolean; major: boolean; days: number[] };
  const STOPS: Record<string, Stop> = {};
  for (const [key, s] of Object.entries(plan.stops)) {
    STOPS[key] = { key, name: s.name, xy: proj(s.lat, s.lon), side: s.side, night: !!s.night, off: !!s.off, major: !!s.major, days: [] };
  }

  const mapEl = $('#map'), gLegs = $('#legs'), gStops = $('#stops'), gLabels = $('#labels');
  const traveller = $('#traveller'), pulse = $('#pulse');
  function el(tag: string, attrs: Record<string, string | number>, parent?: Element) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, String(attrs[k]));
    if (parent) parent.appendChild(e);
    return e;
  }
  function legPath(a: string, b: string, mode: string) {
    const [x1, y1] = STOPS[a].xy, [x2, y2] = STOPS[b].xy;
    if (mode === 'boatloop') {
      const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, o = Math.max(L * 0.3, 5 * U);
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      return `M${x1},${y1} Q${mx + nx * o},${my + ny * o} ${x2},${y2} Q${mx - nx * o},${my - ny * o} ${x1},${y1}`;
    }
    if (mode === 'flight') return `M${x1},${y1} Q${(x1 + x2) / 2},${Math.min(y1, y2) - 28 * U} ${x2},${y2}`;
    return `M${x1},${y1} L${x2},${y2}`;
  }

  const labelEls = plan.labels.map((l) => {
    const [x, y] = proj(l.lat, l.lon);
    const t = el('text', { x, y, 'text-anchor': l.anchor, class: l.kind === 'country' ? 'c-label' : 's-label' }, gLabels);
    t.textContent = l.text;
    return t;
  });

  type Day = (typeof plan.days)[number] & { g: Element; paths: SVGPathElement[]; stops: string[] };
  const DAYS: Day[] = plan.days.map((d) => {
    const g = el('g', { class: 'day-legs', 'data-day': d.n }, gLegs);
    const paths = d.legs.map(([a, b, m]) => el('path', { d: legPath(a, b, m), class: 'leg mode-' + m }, g) as SVGPathElement);
    const stops: string[] = [];
    for (const k of [...d.legs.flatMap(([a, b]) => [a, b]), ...(d.stops ?? [])]) {
      if (!STOPS[k].off && !stops.includes(k)) { stops.push(k); STOPS[k].days.push(d.n); }
    }
    return { ...d, g, paths, stops };
  });
  const idxOf = (n: number) => DAYS.findIndex((d) => d.n === n);

  const stopEls: Record<string, { g: Element; c: Element; t: Element; s: Stop }> = {};
  for (const [k, s] of Object.entries(STOPS)) {
    if (s.off || !s.days.length) continue;
    const g = el('g', { class: 'stop' + (s.night ? ' night' : '') + (s.major ? ' major' : ''), tabindex: 0, role: 'button', 'aria-label': `${s.name} (día ${s.days.join(', ')})`, 'data-stop': k }, gStops);
    const c = el('circle', { cx: s.xy[0], cy: s.xy[1], r: 4 }, g);
    const t = el('text', { x: s.xy[0], y: s.xy[1], 'text-anchor': s.side === 'l' ? 'end' : s.side === 'r' ? 'start' : 'middle' }, g);
    t.textContent = s.name;
    el('title', {}, g).textContent = `${s.name} · día ${s.days.join(', ')}`;
    stopEls[k] = { g, c, t, s };
    g.addEventListener('click', () => onStop(k));
    g.addEventListener('keydown', (e) => { const ke = e as KeyboardEvent; if (ke.key === 'Enter' || ke.key === ' ') { ke.preventDefault(); onStop(k); } });
  }

  if (Object.values(STOPS).some((s) => s.major)) mapEl.classList.add('has-major');

  /* Escala: radios y textos constantes en pantalla aunque el mapa haga zoom */
  let vb = { x: 0, y: 0, w: P.W, h: P.H };
  let lastU = 1;
  function upp() {
    const r = svg.getBoundingClientRect();
    if (!r.width || !r.height) return 1;
    return Math.max(vb.w / r.width, vb.h / r.height);
  }
  function rescale() {
    const u = (lastU = upp());
    for (const o of Object.values(stopEls)) {
      o.c.setAttribute('r', String((o.s.night ? 5.5 : 4) * u));
      o.t.setAttribute('font-size', String(12.5 * u));
      o.t.setAttribute('stroke-width', String(3.5 * u));
      const side = o.s.side;
      o.t.setAttribute('x', String(o.s.xy[0] + (side === 'l' ? -9 : side === 'r' ? 9 : 0) * u));
      o.t.setAttribute('y', String(o.s.xy[1] + (side === 't' ? -9 : side === 'b' ? 17 : 4.3) * u));
    }
    for (const t of labelEls) t.setAttribute('font-size', String((t.getAttribute('class') === 'c-label' ? 10.5 : 12) * u));
    traveller.setAttribute('r', String(6 * u));
  }
  function setVB(v: typeof vb) {
    vb = v;
    svg.setAttribute('viewBox', `${v.x} ${v.y} ${v.w} ${v.h}`);
    rescale();
  }
  function fit(minx: number, miny: number, maxx: number, maxy: number, pad: number) {
    const r = svg.getBoundingClientRect();
    const ar = r.width && r.height ? r.width / r.height : P.W / P.H;
    let w = Math.max(maxx - minx, 60 * U) + 2 * pad, h = Math.max(maxy - miny, 60 * U) + 2 * pad;
    if (w / h > ar) h = w / ar; else w = h * ar;
    const cx = (minx + maxx) / 2, cy = (miny + maxy) / 2;
    return { x: cx - w / 2, y: cy - h / 2, w, h };
  }
  const mapBox = () => fit(4 * U, 4 * U, P.W - 4 * U, P.H - 4 * U, 0);
  /** Vista general: el contorno entero o, si el plan lo pide, lo que abarcan las paradas */
  function fullBox() {
    if (plan.overviewFit !== 'stops') return mapBox();
    const pts = Object.values(STOPS).filter((s) => !s.off && s.days.length).map((s) => s.xy);
    const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
    const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
    // margen proporcional a la ruta: deja sitio a las etiquetas de los extremos
    return fit(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys), Math.max(30 * U, span * 0.2));
  }
  function dayBox(d: Day) {
    const xs: number[] = [], ys: number[] = [];
    for (const k of [...d.legs.flatMap(([a, b]) => [a, b]), ...(d.stops ?? [])]) {
      const [x, y] = STOPS[k].xy;
      xs.push(Math.min(Math.max(x, -15 * U), P.W + 15 * U)); ys.push(y);
    }
    if (!xs.length) return fullBox();
    return fit(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys), 34 * U);
  }
  let raf = 0;
  function animateTo(t: typeof vb) {
    cancelAnimationFrame(raf);
    if (reduceMotion) { setVB(t); return; }
    const s = { ...vb }, t0 = performance.now(), D = 700;
    const step = (now: number) => {
      let p = Math.min(1, (now - t0) / D);
      p = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      setVB({ x: s.x + (t.x - s.x) * p, y: s.y + (t.y - s.y) * p, w: s.w + (t.w - s.w) * p, h: s.h + (t.h - s.h) * p });
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }

  /* Punto que recorre el día */
  let travRaf = 0;
  function runTraveller(d: Day) {
    cancelAnimationFrame(travRaf);
    let paths = d.paths.filter((_, i) => d.legs[i][2] !== 'flight');
    if (!paths.length) paths = d.paths;
    if (!paths.length) { traveller.style.opacity = '0'; return; }
    const lens = paths.map((p) => p.getTotalLength());
    const total = lens.reduce((a, b) => a + b, 0);
    const place = (dist: number) => {
      for (let i = 0; i < paths.length; i++) {
        if (dist <= lens[i] || i === paths.length - 1) {
          const pt = paths[i].getPointAtLength(Math.min(dist, lens[i]));
          traveller.setAttribute('cx', String(pt.x)); traveller.setAttribute('cy', String(pt.y));
          return;
        }
        dist -= lens[i];
      }
    };
    traveller.style.opacity = '1';
    if (reduceMotion || !total) { place(total); return; }
    const t0 = performance.now(), D = Math.min(2400, 900 + (total / U) * 6);
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / D);
      place(total * (1 - Math.pow(1 - p, 2)));
      if (p < 1) travRaf = requestAnimationFrame(step);
    };
    travRaf = requestAnimationFrame(step);
  }
  function doPulse(k: string) {
    const [x, y] = STOPS[k].xy;
    pulse.setAttribute('cx', String(x)); pulse.setAttribute('cy', String(y));
    if (reduceMotion) return;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / 1100);
      pulse.setAttribute('r', String((6 + 26 * p) * lastU));
      pulse.setAttribute('opacity', String(1 - p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* Día activo */
  let active = 0;
  const strip = $('#strip');
  const chips = $$<HTMLButtonElement>('.chip', strip);
  chips.forEach((b) => b.addEventListener('click', () => goDay(Number(b.dataset.day))));
  const dayEls = $$('.day');
  const kicker = $('#map-kicker'), mapLabel = $('#map-label');
  const btnPrev = $<HTMLButtonElement>('#map-prev'), btnNext = $<HTMLButtonElement>('#map-next'), btnAll = $('#map-all');

  function setActive(n: number) {
    const i = idxOf(n);
    if (n === active || i < 0) return;
    active = n;
    const d = DAYS[i];
    mapEl.classList.remove('overview'); mapEl.classList.add('has-active');
    btnAll.setAttribute('aria-pressed', 'false');
    DAYS.forEach((x) => x.g.classList.toggle('is-active', x.n === n));
    gLegs.appendChild(d.g);
    for (const [k, o] of Object.entries(stopEls)) o.g.classList.toggle('on', d.stops.includes(k));
    chips.forEach((c, j) => (j === i ? c.setAttribute('aria-current', 'true') : c.removeAttribute('aria-current')));
    const chip = chips[i];
    const sr = strip.getBoundingClientRect(), cr = chip.getBoundingClientRect();
    if (cr.left < sr.left || cr.right > sr.right) strip.scrollBy({ left: cr.left - sr.left - sr.width / 2 + cr.width / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
    dayEls.forEach((a) => a.classList.toggle('is-active', Number(a.dataset.day) === n));
    kicker.textContent = `Día ${n} · ${d.date}`;
    mapLabel.textContent = d.label;
    btnPrev.disabled = i === 0; btnNext.disabled = i === DAYS.length - 1;
    animateTo(dayBox(d));
    runTraveller(d);
  }
  function showAll() {
    active = 0;
    mapEl.classList.add('overview'); mapEl.classList.remove('has-active');
    btnAll.setAttribute('aria-pressed', 'true');
    DAYS.forEach((x) => x.g.classList.remove('is-active'));
    for (const o of Object.values(stopEls)) o.g.classList.remove('on');
    kicker.textContent = plan.overview.kicker;
    mapLabel.textContent = plan.overview.label;
    btnPrev.disabled = false; btnNext.disabled = false;
    traveller.style.opacity = '0';
    animateTo(fullBox());
  }
  let lockUntil = 0;
  /** Día anterior o siguiente al activo (o el primero, desde la vista general) */
  const stepDay = (delta: number) => {
    const i = active ? idxOf(active) + delta : 0;
    return DAYS[Math.max(0, Math.min(DAYS.length - 1, i))].n;
  };
  function goDay(n: number) {
    if (idxOf(n) < 0) n = DAYS[0].n;
    lockUntil = performance.now() + (reduceMotion ? 150 : 1100);
    $('#dia-' + n)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    setActive(n);
    history.replaceState(null, '', '#dia-' + n);
  }
  btnPrev.addEventListener('click', () => goDay(stepDay(-1)));
  btnNext.addEventListener('click', () => goDay(stepDay(1)));
  btnAll.addEventListener('click', showAll);

  function focusStop(k: string) {
    const [x, y] = STOPS[k].xy, r = 45 * U;
    animateTo(fit(x - r, y - r, x + r, y + r, 12 * U));
    stopEls[k]?.g.classList.add('on');
    setTimeout(() => doPulse(k), reduceMotion ? 0 : 450);
  }
  function onStop(k: string) {
    const days = STOPS[k].days;
    if (days.includes(active)) { focusStop(k); return; }
    goDay(days[0]);
    setTimeout(() => doPulse(k), reduceMotion ? 0 : 750);
  }
  $$<HTMLButtonElement>('.place').forEach((b) => {
    b.addEventListener('click', () => {
      const k = b.dataset.stop!;
      const day = Number((b.closest('.day') as HTMLElement).dataset.day);
      if (active !== day) setActive(day);
      if (mobileMQ.matches) openSheet();
      setTimeout(() => focusStop(k), mobileMQ.matches && !reduceMotion ? 320 : 0);
    });
  });

  /* Día visible al hacer scroll */
  const io = new IntersectionObserver((entries) => {
    if (performance.now() < lockUntil) return;
    for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.day));
  }, { rootMargin: '-38% 0px -58% 0px' });
  dayEls.forEach((a) => io.observe(a));

  /* Hoja del mapa en el móvil */
  const wrap = $('#map-wrap'), fab = $<HTMLButtonElement>('#fab'), scrim = $('#scrim');
  let mapVisible = true, inRoute = false;
  const updateFab = () => { fab.hidden = !(mobileMQ.matches && inRoute && !mapVisible && !mapEl.classList.contains('is-sheet')); };
  new IntersectionObserver((es) => { mapVisible = es[0].isIntersecting; updateFab(); }, { threshold: 0.15 }).observe(wrap);
  new IntersectionObserver((es) => { inRoute = es[0].isIntersecting; updateFab(); }).observe($('#days'));
  const refit = () => setVB(active ? dayBox(DAYS[idxOf(active)]) : fullBox());
  function openSheet() {
    if (!mobileMQ.matches || mapEl.classList.contains('is-sheet')) return;
    wrap.style.minHeight = mapEl.offsetHeight + 'px';
    mapEl.classList.add('is-sheet'); scrim.hidden = false; updateFab();
    refit();
    $('#map-close').focus({ preventScroll: true });
  }
  function closeSheet() {
    if (!mapEl.classList.contains('is-sheet')) return;
    mapEl.classList.remove('is-sheet'); scrim.hidden = true; wrap.style.minHeight = '';
    updateFab(); refit();
  }
  fab.addEventListener('click', openSheet);
  scrim.addEventListener('click', closeSheet);
  $('#map-close').addEventListener('click', closeSheet);
  mobileMQ.addEventListener('change', () => { closeSheet(); updateFab(); refit(); });
  let rt = 0;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = window.setTimeout(refit, 120); });

  /* Pestañas */
  const tabs = $$<HTMLButtonElement>('.tab');
  function selectTab(t: HTMLButtonElement, focus?: boolean) {
    for (const x of tabs) {
      const on = x === t;
      x.setAttribute('aria-selected', on ? 'true' : 'false');
      x.tabIndex = on ? 0 : -1;
      $('#' + x.getAttribute('aria-controls')).hidden = !on;
    }
    if (focus) t.focus();
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectTab(t));
    t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault(); e.stopPropagation();
        selectTab(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length], true);
      }
    });
  });

  /* Conversor: euros y cada moneda de la planificación */
  const eur = $<HTMLInputElement>('#fx-eur');
  if (eur) {
    const curInputs = $$<HTMLInputElement>('input[data-rate]');
    const out = $('#fx-out');
    const nf0 = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 });
    const nf2 = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 });
    const writeOut = () => {
      const e = parseFloat(eur.value);
      out.textContent = isFinite(e)
        ? nf2.format(e) + ' € ≈ ' + curInputs.map((c) => nf0.format(Math.round(e * Number(c.dataset.rate))) + ' ' + c.dataset.symbol).join(' ≈ ')
        : 'Escribe una cantidad';
    };
    const fromEur = (skip?: HTMLInputElement) => {
      const v = parseFloat(eur.value);
      for (const c of curInputs) if (c !== skip) c.value = isFinite(v) ? String(Math.round(v * Number(c.dataset.rate))) : '';
      writeOut();
    };
    eur.addEventListener('input', () => fromEur());
    for (const c of curInputs) {
      c.addEventListener('input', () => {
        const v = parseFloat(c.value);
        eur.value = isFinite(v) ? String(Math.round((v / Number(c.dataset.rate)) * 100) / 100) : '';
        fromEur(c);
      });
    }
    $$<HTMLButtonElement>('.presets button').forEach((b) => {
      b.addEventListener('click', () => {
        if (b.dataset.eur) { eur.value = b.dataset.eur; fromEur(); return; }
        const c = curInputs.find((x) => x.dataset.code === b.dataset.code);
        if (c) { c.value = b.dataset.amount || ''; c.dispatchEvent(new Event('input')); }
      });
    });
    fromEur();
  }

  /* Comida */
  const foodKey = `plan-${plan.id}-comida-v1`;
  let want = store.get<string[]>(foodKey, plan.id === 'albania' ? store.get<string[]>('albania-comida-v1', []) : []);
  if (!Array.isArray(want)) want = [];
  const dishesEl = $('#dishes');
  const total = plan.dishes.items.length;
  let filter = 'all';
  plan.dishes.items.forEach((d, i) => {
    const li = document.createElement('li');
    li.className = 'dish'; li.dataset.cat = d.cat; li.dataset.i = String(i);
    li.innerHTML = `<span class="cat">${plan.dishes.cats[d.cat] ?? d.cat}</span><h3>${d.name}</h3><p>${d.desc}</p>` +
      `<button class="heart" type="button" aria-pressed="false" aria-label="Quiero probar ${d.name}"><svg><use href="#i-heart"/></svg></button>`;
    li.querySelector('.heart')!.addEventListener('click', () => {
      const k = want.indexOf(d.name);
      if (k >= 0) want.splice(k, 1); else want.push(d.name);
      store.set(foodKey, want);
      paintFood();
    });
    dishesEl.appendChild(li);
  });
  function paintFood() {
    for (const li of $$('.dish', dishesEl)) {
      const on = want.includes(plan.dishes.items[Number(li.dataset.i)].name);
      li.classList.toggle('want', on);
      li.querySelector('.heart')!.setAttribute('aria-pressed', on ? 'true' : 'false');
      li.hidden = filter === 'want' ? !on : filter !== 'all' && li.dataset.cat !== filter;
    }
    $('#want-n').textContent = String(want.length);
    $('#food-tally').innerHTML = want.length
      ? `En vuestra lista: <b>${want.length}</b> de ${total}. Se guarda en este navegador.`
      : 'Marca con el corazón lo que queráis probar. Se guarda en este navegador.';
  }
  $$<HTMLButtonElement>('#food-filters button').forEach((b) => {
    b.addEventListener('click', () => {
      filter = b.dataset.f!;
      $$('#food-filters button').forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      paintFood();
    });
  });
  paintFood();

  /* Maleta */
  const packKey = `plan-${plan.id}-maleta-v1`;
  let packed = store.get<Record<string, 1>>(packKey, plan.id === 'albania' ? store.get<Record<string, 1>>('albania-maleta-v1', {}) : {});
  if (!packed || typeof packed !== 'object') packed = {};
  const packsEl = $('#packs');
  let totalItems = 0;
  for (const cat of plan.pack) {
    const box = document.createElement('div');
    box.className = 'pack' + (cat.trip ? ' trip' : ''); box.dataset.cat = cat.id;
    let html = `<header><h3>${cat.title}</h3><span class="cnt"></span></header><ul>`;
    cat.items.forEach((it, i) => {
      const [label, note] = Array.isArray(it) ? it : [it, ''];
      const id = `pk-${cat.id}-${i}`;
      html += `<li><label class="check" for="${id}"><input type="checkbox" id="${id}"><span>${label}${note ? `<small>${note}</small>` : ''}</span></label></li>`;
      totalItems++;
    });
    box.innerHTML = html + '</ul>';
    packsEl.appendChild(box);
  }
  const boxes = $$<HTMLInputElement>('#packs input[type=checkbox]');
  const bar = $('#pack-bar');
  function paintPack() {
    const done = boxes.filter((b) => b.checked).length;
    $('#pack-text').innerHTML = `<b>${done}</b> de ${totalItems} en la maleta`;
    (bar.firstElementChild as HTMLElement).style.width = (100 * done) / totalItems + '%';
    bar.setAttribute('aria-valuemax', String(totalItems)); bar.setAttribute('aria-valuenow', String(done));
    for (const p of $$('.pack', packsEl)) {
      const cb = $$<HTMLInputElement>('input', p), d = cb.filter((x) => x.checked).length;
      p.querySelector('.cnt')!.textContent = `${d}/${cb.length}`;
      p.classList.toggle('done', d === cb.length);
    }
  }
  for (const b of boxes) {
    b.checked = !!packed[b.id];
    b.addEventListener('change', () => {
      if (b.checked) packed[b.id] = 1; else delete packed[b.id];
      store.set(packKey, packed);
      paintPack();
    });
  }
  paintPack();
  const ask = $<HTMLButtonElement>('#reset-ask'), confirmBox = $('#reset-confirm');
  ask.addEventListener('click', () => { ask.hidden = true; confirmBox.hidden = false; $('#reset-no').focus(); });
  $('#reset-no').addEventListener('click', () => { confirmBox.hidden = true; ask.hidden = false; ask.focus(); });
  $('#reset-yes').addEventListener('click', () => {
    for (const b of boxes) b.checked = false;
    packed = {}; store.set(packKey, packed); paintPack();
    confirmBox.hidden = true; ask.hidden = false; ask.focus();
  });

  /* Visor de fotos */
  const shots = $$<HTMLButtonElement>('[data-lb]'), lb = $('#lb'), lbImg = $<HTMLImageElement>('#lb-img');
  const lbCap = $('#lb-cap'), lbCount = $('#lb-count');
  let cur = 0, lastFocus: HTMLElement | null = null;
  function showShot(i: number) {
    cur = (i + shots.length) % shots.length;
    const b = shots[cur], img = b.querySelector('img')!;
    lbImg.src = img.dataset.full || img.currentSrc || img.src; lbImg.alt = img.alt;
    lbCap.textContent = b.dataset.lb!;
    lbCount.textContent = `${cur + 1} / ${shots.length}`;
  }
  function openLb(i: number) { lastFocus = document.activeElement as HTMLElement; showShot(i); lb.hidden = false; document.body.style.overflow = 'hidden'; $('#lb-close').focus(); }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ''; lastFocus?.focus({ preventScroll: true }); }
  shots.forEach((b, i) => b.addEventListener('click', () => openLb(i)));
  $('#lb-close').addEventListener('click', closeLb);
  $('#lb-prev').addEventListener('click', () => showShot(cur - 1));
  $('#lb-next').addEventListener('click', () => showShot(cur + 1));
  lb.addEventListener('click', (e) => { const t = e.target as HTMLElement; if (t === lb || t.classList.contains('lb-fig')) closeLb(); });
  let tx: number | null = null;
  lb.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) showShot(cur + (dx < 0 ? 1 : -1)); tx = null; });

  /* Teclado */
  document.addEventListener('keydown', (e) => {
    if (!lb.hidden) {
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowRight') showShot(cur + 1);
      else if (e.key === 'ArrowLeft') showShot(cur - 1);
      return;
    }
    if (e.key === 'Escape' && mapEl.classList.contains('is-sheet')) { closeSheet(); return; }
    const t = e.target as HTMLElement, tag = (t.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || t.getAttribute('role') === 'tab' || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); goDay(stepDay(1)); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); goDay(stepDay(-1)); }
  });

  /* Volver al portfolio en el idioma de donde se viene */
  try {
    const ref = document.referrer ? new URL(document.referrer) : null;
    if (ref && ref.origin === location.origin) {
      const seg = ref.pathname.split('/')[1];
      if (seg === 'en' || seg === 'ca') for (const a of $$<HTMLAnchorElement>('[data-back]')) a.href = `/${seg}/#planificaciones`;
    }
  } catch { /* referrer raro */ }

  /* Arranque */
  setVB(fullBox());
  const m = /^#dia-(\d+)$/.exec(location.hash);
  if (m) setActive(Number(m[1]));
}
