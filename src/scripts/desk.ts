// The look of the desktop: colour scheme and wallpaper, the <display-props> dialog that changes them,
// and the right-click menu on the desktop. The choice lives in localStorage; Base.astro applies the
// saved CSS variables before first paint so the desktop never flashes teal first.
export type Mode = 'tile' | 'centre' | 'stretch';
export type Desk = { scheme: string; wall: string; mode: Mode };

type Scheme = { name: string; desk: string; a: string; b: string; hi: string; dark?: boolean };
export const SCHEMES: Record<string, Scheme> = {
  standard: { name: 'Standard', desk: '#008080', a: '#000080', b: '#1084d0', hi: '#000080' },
  monsoon: { name: 'Monsoon', desk: '#2f5d50', a: '#0b3d2e', b: '#3fa37c', hi: '#0b3d2e' },
  night: { name: 'Night Ride', desk: '#101018', a: '#1a1a40', b: '#6a3fd0', hi: '#30207a', dark: true },
  brick: { name: 'Brick', desk: '#7a2e1e', a: '#5a1206', b: '#d0661a', hi: '#5a1206' },
  plum: { name: 'Plum', desk: '#4b2a5a', a: '#3a0f4f', b: '#b04fc0', hi: '#3a0f4f' },
  slate: { name: 'Slate', desk: '#3a4a5c', a: '#1c2b3a', b: '#7f9bb5', hi: '#1c2b3a' },
};

// Patterns are drawn in translucent black and white, so each one takes on whatever desktop colour is behind it.
const tile = (w: number, h: number, body: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' shape-rendering='crispEdges'>${body}</svg>`)}")`;
const K = (o: number) => `fill='#000' fill-opacity='${o}'`;
const Wh = (o: number) => `fill='#fff' fill-opacity='${o}'`;
export const WALLS: Record<string, { name: string; img: string }> = {
  none: { name: '(None)', img: 'none' },
  checks: { name: 'Checks', img: tile(16, 16, `<rect width='8' height='8' ${K(0.14)}/><rect x='8' y='8' width='8' height='8' ${K(0.14)}/>`) },
  dots: { name: 'Dots', img: tile(8, 8, `<rect x='1' y='1' width='2' height='2' ${Wh(0.28)}/><rect x='5' y='5' width='2' height='2' ${K(0.2)}/>`) },
  weave: {
    name: 'Weave',
    img: tile(8, 8, [0, 1, 2, 3].map((i) => `<rect x='${i}' y='${i}' width='1' height='1' ${Wh(0.3)}/><rect x='${7 - i}' y='${i}' width='1' height='1' ${K(0.25)}/>`).join('')),
  },
  bricks: {
    name: 'Bricks',
    img: tile(32, 16, `<rect width='32' height='1' ${K(0.3)}/><rect y='8' width='32' height='1' ${K(0.3)}/><rect width='1' height='8' ${K(0.3)}/><rect x='16' y='8' width='1' height='8' ${K(0.3)}/><rect y='1' x='1' width='31' height='1' ${Wh(0.12)}/><rect y='9' width='32' height='1' ${Wh(0.12)}/>`),
  },
  tarmac: {
    name: 'Tarmac',
    img: tile(96, 64, `<rect width='96' height='64' ${K(0.3)}/><rect x='47' y='10' width='2' height='20' ${Wh(0.4)}/><rect x='7' y='20' width='1' height='1' ${Wh(0.15)}/><rect x='70' y='50' width='1' height='1' ${Wh(0.15)}/><rect x='24' y='44' width='1' height='1' ${Wh(0.12)}/><rect x='84' y='12' width='1' height='1' ${Wh(0.12)}/>`),
  },
  circuit: {
    name: 'Circuit',
    img: tile(32, 32, `<rect x='4' y='6' width='14' height='1' ${Wh(0.3)}/><rect x='17' y='6' width='1' height='12' ${Wh(0.3)}/><rect x='17' y='17' width='11' height='1' ${Wh(0.3)}/><rect x='3' y='5' width='3' height='3' ${Wh(0.45)}/><rect x='27' y='16' width='3' height='3' ${Wh(0.45)}/><rect x='8' y='20' width='1' height='10' ${K(0.3)}/><rect x='8' y='24' width='6' height='1' ${K(0.3)}/><rect x='7' y='29' width='3' height='3' ${K(0.4)}/><rect x='13' y='23' width='3' height='3' ${K(0.4)}/>`),
  },
  stars: {
    name: 'Stars',
    img: tile(64, 64, [[5, 9], [22, 4], [40, 17], [57, 8], [13, 30], [33, 41], [51, 33], [8, 54], [27, 58], [45, 52], [60, 47], [18, 18]].map(([x, y], i) => `<rect x='${x}' y='${y}' width='${i % 5 === 0 ? 2 : 1}' height='${i % 5 === 0 ? 2 : 1}' ${Wh(i % 3 === 0 ? 0.9 : 0.5)}/>`).join('')),
  },
  picture: { name: 'My painting', img: 'none' },
};

const KEY = 'desk', KEY_CSS = 'desk-css', KEY_PIC = 'desk-pic';
const DEFAULT: Desk = { scheme: 'standard', wall: 'none', mode: 'tile' };
const read = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k: string, v: string) => { try { localStorage.setItem(k, v); return true; } catch { return false; } };

export const getPicture = () => read(KEY_PIC);
export function getDesk(): Desk {
  try {
    const d = { ...DEFAULT, ...JSON.parse(read(KEY) || '{}') } as Desk;
    if (!SCHEMES[d.scheme]) d.scheme = DEFAULT.scheme;
    if (!WALLS[d.wall] || (d.wall === 'picture' && !getPicture())) d.wall = DEFAULT.wall;
    if (!['tile', 'centre', 'stretch'].includes(d.mode)) d.mode = DEFAULT.mode;
    return d;
  } catch { return { ...DEFAULT }; }
}

/** The CSS custom properties that draw a given choice. */
export function cssFor(d: Desk): Record<string, string> {
  const s = SCHEMES[d.scheme] ?? SCHEMES.standard;
  const pic = d.wall === 'picture' ? getPicture() : null;
  const img = pic ? `url("${pic}")` : (WALLS[d.wall]?.img ?? 'none');
  const fit = pic ? d.mode : 'tile'; // patterns only make sense tiled
  return {
    '--desk': s.desk, '--title-a': s.a, '--title-b': s.b, '--navy': s.hi,
    '--desk-img': img,
    '--desk-rep': fit === 'tile' ? 'repeat' : 'no-repeat',
    '--desk-pos': fit === 'tile' ? '0 0' : 'center',
    '--desk-size': fit === 'stretch' ? 'cover' : 'auto',
    // black pixel icons need an edge on a dark desktop; labels over a picture get the desktop colour behind them, as they did
    '--icon-glow': s.dark ? 'drop-shadow(0 0 1px #fff)' : 'drop-shadow(0 0 0 transparent)',
    '--icon-bg': pic ? s.desk : 'transparent',
  };
}

export function applyDesk(d: Desk, persist = true) {
  const css = cssFor(d);
  for (const [k, v] of Object.entries(css)) document.documentElement.style.setProperty(k, v);
  document.querySelector('meta[name=theme-color]')?.setAttribute('content', css['--desk']);
  if (persist) { write(KEY, JSON.stringify(d)); write(KEY_CSS, JSON.stringify(css)); }
  dispatchEvent(new Event('deskchange'));
}

/** Called by Paint: keep the drawing and put it on the desktop. False if the browser refused to store it. */
export function setPicture(dataUrl: string): boolean {
  if (!write(KEY_PIC, dataUrl)) return false;
  applyDesk({ ...getDesk(), wall: 'picture' });
  return true;
}

// ---------- Display Properties ----------
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

class DisplayProps extends HTMLElement {
  draft: Desk = { ...DEFAULT };
  onChange = () => { if (this.isConnected) this.render(getDesk()); };

  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = '1';
    this.render(getDesk());
    addEventListener('deskchange', this.onChange);
  }
  disconnectedCallback() { removeEventListener('deskchange', this.onChange); delete this.dataset.ready; }

  render(d: Desk) {
    this.draft = { ...d };
    const hasPic = !!getPicture();
    const walls = Object.entries(WALLS).filter(([k]) => k !== 'picture' || hasPic);
    this.innerHTML = `<div class="dp">
      <div class="dp-monitor" aria-hidden="true"><div class="dp-screen"><div class="dp-mini"><b></b><i></i></div></div><div class="dp-neck"></div><div class="dp-foot"></div></div>
      <div class="dp-fields">
        <label class="dp-f dp-wall"><span>Wallpaper</span>
          <select size="${walls.length}" data-wall>${walls.map(([k, w]) => `<option value="${k}"${k === d.wall ? ' selected' : ''}>${esc(w.name)}</option>`).join('')}</select></label>
        <div class="dp-side">
          <label class="dp-f"><span>Display</span>
            <select data-mode>${(['tile', 'centre', 'stretch'] as Mode[]).map((m) => `<option value="${m}"${m === d.mode ? ' selected' : ''}>${m[0].toUpperCase() + m.slice(1)}</option>`).join('')}</select></label>
          <label class="dp-f"><span>Scheme</span>
            <select data-scheme>${Object.entries(SCHEMES).map(([k, s]) => `<option value="${k}"${k === d.scheme ? ' selected' : ''}>${esc(s.name)}</option>`).join('')}</select></label>
        </div>
      </div>
      <p class="ui dp-hint">${hasPic ? 'Your painting is in the list.' : 'Want your own?'} <a href="/apps/paint/">Open Paint</a> and choose <b>Set as wallpaper</b>.</p>
      <div class="btns"><button type="button" class="default" data-ok>OK</button><button type="button" data-cancel>Cancel</button><button type="button" data-apply>Apply</button></div>
    </div>`;
    const wall = this.querySelector<HTMLSelectElement>('[data-wall]')!;
    const mode = this.querySelector<HTMLSelectElement>('[data-mode]')!;
    const scheme = this.querySelector<HTMLSelectElement>('[data-scheme]')!;
    const sync = () => {
      this.draft = { wall: wall.value || 'none', mode: mode.value as Mode, scheme: scheme.value };
      mode.disabled = this.draft.wall !== 'picture';
      const screen = this.querySelector<HTMLElement>('.dp-screen')!;
      for (const [k, v] of Object.entries(cssFor(this.draft))) screen.style.setProperty(k, v);
    };
    [wall, mode, scheme].forEach((el) => el.addEventListener('change', sync));
    sync();
    const shut = () => this.closest('[data-win]')?.querySelector<HTMLElement>('[data-close]')?.click();
    this.querySelector('[data-apply]')!.addEventListener('click', () => applyDesk(this.draft));
    this.querySelector('[data-ok]')!.addEventListener('click', () => { applyDesk(this.draft); shut(); });
    this.querySelector('[data-cancel]')!.addEventListener('click', () => { this.render(getDesk()); shut(); });
  }
}
if (!customElements.get('display-props')) customElements.define('display-props', DisplayProps);

// ---------- right-click menu on the desktop ----------
export function initDeskMenu(desk: HTMLElement) {
  let menu: HTMLElement | null = null;
  const close = () => { menu?.remove(); menu = null; };
  desk.addEventListener('contextmenu', (e) => {
    const t = e.target as HTMLElement;
    // only the bare desktop: windows, icons and gadgets keep the browser's own menu
    if (t !== desk && !t.matches('.icons')) return;
    if (matchMedia('(max-width: 700px)').matches) return;
    e.preventDefault();
    close();
    menu = document.createElement('div');
    menu.className = 'ctx';
    menu.setAttribute('role', 'menu');
    menu.innerHTML = `<button type="button" role="menuitem" data-refresh>Refresh</button><hr>
      <a role="menuitem" href="/apps/paint/">New drawing</a><hr>
      <a role="menuitem" href="/apps/display/">Properties</a>`;
    document.body.appendChild(menu);
    const x = Math.min(e.clientX, innerWidth - menu.offsetWidth - 4);
    const y = Math.min(e.clientY, innerHeight - menu.offsetHeight - 34);
    menu.style.left = `${Math.max(0, x)}px`;
    menu.style.top = `${Math.max(0, y)}px`;
    menu.querySelector('[data-refresh]')!.addEventListener('click', () => {
      // what Refresh did in 1998: the icons blink and nothing else changes
      const icons = desk.querySelector<HTMLElement>('.icons');
      if (icons) { icons.style.visibility = 'hidden'; setTimeout(() => { icons.style.visibility = ''; }, 140); }
    });
    menu.addEventListener('click', () => setTimeout(close));
    menu.querySelector<HTMLElement>('[role=menuitem]')?.focus();
    menu.addEventListener('keydown', (ev) => {
      if (ev.key !== 'ArrowDown' && ev.key !== 'ArrowUp') return;
      const items = [...menu!.querySelectorAll<HTMLElement>('[role=menuitem]')];
      const i = items.indexOf(document.activeElement as HTMLElement);
      items[(i + (ev.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus();
      ev.preventDefault();
    });
  });
  document.addEventListener('pointerdown', (e) => { if (menu && !menu.contains(e.target as Node)) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  addEventListener('blur', close);
  addEventListener('resize', close);
}
