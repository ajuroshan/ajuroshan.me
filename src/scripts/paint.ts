// <paint-app>: a small pixel paint program, as a custom element so it also works inside windows adopted
// from other pages. Everything is drawn with whole pixels (no anti-aliasing), the drawing is kept in
// localStorage between visits, and it can be saved as a PNG or put on the desktop as wallpaper.
import { setPicture } from './desk';

const W = 448, H = 280;
const DOC = 'paint-doc';
const COLORS = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080', '#808040', '#004040', '#0080ff', '#004080', '#8000ff', '#804000',
  '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ffff80', '#00ff80', '#80ffff', '#8080ff', '#ff0080', '#ff8040',
];
type Tool = 'pencil' | 'brush' | 'eraser' | 'fill' | 'pick' | 'spray' | 'line' | 'rect' | 'frect' | 'oval';
const svg = (body: string) => `<svg viewBox="0 0 16 16" width="16" height="16" shape-rendering="crispEdges" aria-hidden="true">${body}</svg>`;
const TOOLS: { id: Tool; name: string; icon: string }[] = [
  { id: 'pencil', name: 'Pencil', icon: svg('<path d="M3 13l1-3 7-7 2 2-7 7z" fill="#ff0" stroke="#000"/><path d="M3 13l1-3 2 2z"/>') },
  { id: 'brush', name: 'Brush', icon: svg('<rect x="7" y="1" width="2" height="7" fill="#808000" stroke="#000" stroke-width=".5"/><rect x="5" y="8" width="6" height="2" fill="#c0c0c0" stroke="#000" stroke-width=".5"/><path d="M5 10h6v2l-2 3H7l-2-3z"/>') },
  { id: 'eraser', name: 'Eraser', icon: svg('<path d="M2 11l6-6h6l-6 6z" fill="#fff" stroke="#000"/><path d="M2 11h6v3H2z" fill="#f8a" stroke="#000"/><path d="M8 11l6-6v3l-6 6z" fill="#c68" stroke="#000"/>') },
  { id: 'fill', name: 'Fill with colour', icon: svg('<path d="M7 2l6 6-5 5-6-6z" fill="#c0c0c0" stroke="#000"/><path d="M3 7h9l-4 4z" fill="#00f"/><path d="M13 9c1 2 2 3 2 4a2 2 0 0 1-3 0c0-1 0-2 1-4z" fill="#00f"/><path d="M7 2V0" stroke="#000"/>') },
  { id: 'pick', name: 'Pick a colour', icon: svg('<path d="M11 1l4 4-2 2-4-4z"/><path d="M9 4l3 3-6 6H3v-3z" fill="#fff" stroke="#000"/><path d="M2 13l1 1-2 1z"/>') },
  { id: 'spray', name: 'Spray can', icon: svg('<rect x="6" y="6" width="6" height="9" fill="#c0c0c0" stroke="#000"/><rect x="8" y="3" width="2" height="3" fill="#808080" stroke="#000" stroke-width=".5"/><rect x="1" y="1" width="1" height="1"/><rect x="3" y="3" width="1" height="1"/><rect x="1" y="5" width="1" height="1"/><rect x="4" y="1" width="1" height="1"/><rect x="5" y="4" width="1" height="1"/><rect x="2" y="7" width="1" height="1"/>') },
  { id: 'line', name: 'Line', icon: svg('<path d="M2 13L13 2" stroke="#000" stroke-width="1.5"/>') },
  { id: 'rect', name: 'Rectangle', icon: svg('<rect x="2.5" y="4.5" width="11" height="7" fill="none" stroke="#000"/>') },
  { id: 'frect', name: 'Filled rectangle', icon: svg('<rect x="2.5" y="4.5" width="11" height="7" fill="#808080" stroke="#000"/>') },
  { id: 'oval', name: 'Ellipse', icon: svg('<ellipse cx="8" cy="8" rx="5.5" ry="3.5" fill="none" stroke="#000"/>') },
];
const HINT = 'Left button draws with the top colour, right button with the bottom one.';

class PaintApp extends HTMLElement {
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  status!: HTMLElement;
  tool: Tool = 'pencil';
  size = 1;
  fg = '#000000';
  bg = '#ffffff';
  undo: ImageData[] = [];
  saveTimer = 0;

  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = '1';
    this.innerHTML = `<div class="pt">
      <div class="pt-bar">
        <button type="button" data-a="new">New</button><button type="button" data-a="undo">Undo</button>
        <button type="button" data-a="save">Save as PNG</button><button type="button" data-a="wall">Set as wallpaper</button>
      </div>
      <div class="pt-main">
        <div class="pt-side">
          <div class="pt-tools" role="toolbar" aria-label="Tools">${TOOLS.map((t) => `<button type="button" data-tool="${t.id}" title="${t.name}" aria-label="${t.name}" aria-pressed="false">${t.icon}</button>`).join('')}</div>
          <div class="pt-sizes" role="group" aria-label="Line width">${[1, 3, 5].map((s) => `<button type="button" data-size="${s}" title="Width ${s}" aria-label="Width ${s}" aria-pressed="false"><i style="height:${s}px"></i></button>`).join('')}</div>
        </div>
        <div class="pt-view"><canvas width="${W}" height="${H}" aria-label="Drawing area" role="img"></canvas></div>
      </div>
      <div class="pt-foot">
        <button type="button" class="pt-cur" title="Swap the two colours" aria-label="Swap the two colours"><i data-bg></i><i data-fg></i></button>
        <div class="pt-pal" role="group" aria-label="Colours">${COLORS.map((c) => `<button type="button" data-c="${c}" style="--c:${c}" title="${c}" aria-label="Colour ${c}"></button>`).join('')}</div>
      </div>
      <p class="pt-status ui" aria-live="polite">${HINT}</p>
    </div>`;
    this.canvas = this.querySelector('canvas')!;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })!;
    this.status = this.querySelector('.pt-status')!;
    this.clear();
    this.restore();

    this.querySelectorAll<HTMLButtonElement>('[data-tool]').forEach((b) => b.addEventListener('click', () => this.pick(b.dataset.tool as Tool)));
    this.querySelectorAll<HTMLButtonElement>('[data-size]').forEach((b) => b.addEventListener('click', () => { this.size = Number(b.dataset.size); this.paintUi(); }));
    this.querySelectorAll<HTMLButtonElement>('[data-c]').forEach((b) => {
      b.addEventListener('click', () => { this.fg = b.dataset.c!; this.paintUi(); });
      b.addEventListener('contextmenu', (e) => { e.preventDefault(); this.bg = b.dataset.c!; this.paintUi(); });
    });
    this.querySelector('.pt-cur')!.addEventListener('click', () => { [this.fg, this.bg] = [this.bg, this.fg]; this.paintUi(); });
    this.querySelector('[data-a=new]')!.addEventListener('click', () => { this.snap(); this.clear(); this.keep(); this.say('Blank page. Undo brings the old one back.'); });
    this.querySelector('[data-a=undo]')!.addEventListener('click', () => this.back());
    this.querySelector('[data-a=save]')!.addEventListener('click', () => {
      const a = document.createElement('a');
      a.download = 'drawing.png'; a.href = this.canvas.toDataURL('image/png'); a.click();
      this.say('Saved as drawing.png.');
    });
    this.querySelector('[data-a=wall]')!.addEventListener('click', () => {
      this.say(setPicture(this.canvas.toDataURL('image/png'))
        ? 'It is on the desktop now. Display Properties can tile, centre or stretch it.'
        : 'The browser would not store the picture, so the wallpaper stays as it was.');
    });
    this.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); this.back(); } });
    this.pointer();
    this.paintUi();
  }

  say(s: string) { this.status.textContent = s; }
  pick(t: Tool) { this.tool = t; this.paintUi(); this.say(`${TOOLS.find((x) => x.id === t)!.name}. ${HINT}`); }
  paintUi() {
    this.querySelectorAll<HTMLElement>('[data-tool]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tool === this.tool)));
    this.querySelectorAll<HTMLElement>('[data-size]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.size) === this.size)));
    this.querySelector<HTMLElement>('[data-fg]')!.style.background = this.fg;
    this.querySelector<HTMLElement>('[data-bg]')!.style.background = this.bg;
  }

  // ---------- document ----------
  clear() { this.ctx.fillStyle = '#ffffff'; this.ctx.fillRect(0, 0, W, H); }
  snap() { this.undo.push(this.ctx.getImageData(0, 0, W, H)); if (this.undo.length > 20) this.undo.shift(); }
  back() {
    const s = this.undo.pop();
    if (!s) return this.say('Nothing to undo.');
    this.ctx.putImageData(s, 0, 0); this.keep(); this.say('Undone.');
  }
  keep() {
    clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => { try { localStorage.setItem(DOC, this.canvas.toDataURL('image/png')); } catch {} }, 400);
  }
  restore() {
    let saved: string | null = null;
    try { saved = localStorage.getItem(DOC); } catch {}
    if (!saved) return;
    const img = new Image();
    img.onload = () => { if (!this.undo.length) this.ctx.drawImage(img, 0, 0, W, H); };
    img.src = saved;
  }

  // ---------- whole-pixel drawing ----------
  stamp(x: number, y: number, s: number, round: boolean) {
    const c = this.ctx;
    if (s <= 1) { c.fillRect(x, y, 1, 1); return; }
    if (!round) { const h = s >> 1; c.fillRect(x - h, y - h, s, s); return; }
    const r = s >> 1;
    for (let dy = -r; dy <= r; dy++) { const w = Math.floor(Math.sqrt(r * r - dy * dy) + 0.5); c.fillRect(x - w, y + dy, 2 * w + 1, 1); }
  }
  seg(x0: number, y0: number, x1: number, y1: number, s: number, round: boolean) {
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      this.stamp(x0, y0, s, round);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }
  box(x0: number, y0: number, x1: number, y1: number, s: number, filled: boolean) {
    const l = Math.min(x0, x1), t = Math.min(y0, y1), r = Math.max(x0, x1), b = Math.max(y0, y1);
    if (filled) { this.ctx.fillRect(l, t, r - l + 1, b - t + 1); return; }
    this.seg(l, t, r, t, s, false); this.seg(r, t, r, b, s, false); this.seg(r, b, l, b, s, false); this.seg(l, b, l, t, s, false);
  }
  oval(x0: number, y0: number, x1: number, y1: number, s: number) {
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, rx = Math.abs(x1 - x0) / 2, ry = Math.abs(y1 - y0) / 2;
    const n = Math.max(8, Math.ceil(Math.max(rx, ry) * 8));
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; this.stamp(Math.round(cx + rx * Math.cos(a)), Math.round(cy + ry * Math.sin(a)), s, false); }
  }
  spray(x: number, y: number) {
    const r = 5 + this.size * 2;
    for (let i = 0; i < 10 + this.size * 4; i++) {
      const a = Math.random() * Math.PI * 2, d = Math.sqrt(Math.random()) * r;
      this.ctx.fillRect(Math.round(x + d * Math.cos(a)), Math.round(y + d * Math.sin(a)), 1, 1);
    }
  }
  flood(x: number, y: number, color: string) {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const img = this.ctx.getImageData(0, 0, W, H);
    const px = new Uint32Array(img.data.buffer);
    // read the fill colour back from the canvas so it is in the buffer's own byte order
    this.ctx.fillStyle = color; this.ctx.fillRect(x, y, 1, 1);
    const want = new Uint32Array(this.ctx.getImageData(x, y, 1, 1).data.buffer)[0];
    const from = px[y * W + x];
    if (from === want) { this.ctx.putImageData(img, 0, 0); return; }
    const stack = [y * W + x];
    while (stack.length) {
      let i = stack.pop()!;
      if (px[i] !== from) continue;
      const row = Math.floor(i / W) * W;
      while (i > row && px[i - 1] === from) i--;
      for (; i < row + W && px[i] === from; i++) {
        px[i] = want;
        if (i >= W && px[i - W] === from) stack.push(i - W);
        if (i < W * (H - 1) && px[i + W] === from) stack.push(i + W);
      }
    }
    this.ctx.putImageData(img, 0, 0);
  }

  // ---------- pointer ----------
  pointer() {
    const cv = this.canvas;
    const at = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      return [Math.floor(((e.clientX - r.left) * W) / r.width), Math.floor(((e.clientY - r.top) * H) / r.height)] as const;
    };
    let down = false, sx = 0, sy = 0, lx = 0, ly = 0, color = '', base: ImageData | null = null;
    cv.addEventListener('contextmenu', (e) => e.preventDefault());
    cv.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 && e.button !== 2) return;
      e.preventDefault();
      const [x, y] = at(e);
      if (this.tool === 'pick') {
        const d = this.ctx.getImageData(Math.max(0, Math.min(W - 1, x)), Math.max(0, Math.min(H - 1, y)), 1, 1).data;
        const hex = '#' + [d[0], d[1], d[2]].map((v) => v.toString(16).padStart(2, '0')).join('');
        if (e.button === 2) this.bg = hex; else this.fg = hex;
        this.paintUi(); this.say(`Picked ${hex}.`);
        return;
      }
      cv.setPointerCapture(e.pointerId);
      this.snap();
      down = true; sx = lx = x; sy = ly = y;
      color = this.tool === 'eraser' ? this.bg : e.button === 2 ? this.bg : this.fg;
      this.ctx.fillStyle = color;
      if (this.tool === 'fill') { this.flood(x, y, color); down = false; this.keep(); return; }
      base = this.ctx.getImageData(0, 0, W, H);
      this.draw(x, y, x, y, sx, sy, base);
    });
    cv.addEventListener('pointermove', (e) => {
      const [x, y] = at(e);
      if (!down) { if (x >= 0 && y >= 0 && x < W && y < H) this.say(`${x}, ${y}`); return; }
      this.ctx.fillStyle = color;
      this.draw(lx, ly, x, y, sx, sy, base!);
      lx = x; ly = y;
    });
    const up = () => { if (!down) return; down = false; base = null; this.keep(); };
    cv.addEventListener('pointerup', up);
    cv.addEventListener('pointercancel', up);
    cv.addEventListener('pointerleave', () => { if (!down) this.say(HINT); });
  }
  draw(px: number, py: number, x: number, y: number, sx: number, sy: number, base: ImageData) {
    const s = this.size;
    switch (this.tool) {
      case 'pencil': this.seg(px, py, x, y, 1, false); break;
      case 'brush': this.seg(px, py, x, y, s + 2, true); break;
      case 'eraser': this.seg(px, py, x, y, s * 4, false); break;
      case 'spray': this.spray(x, y); break;
      // shapes are redrawn from the picture as it was when the button went down
      case 'line': this.ctx.putImageData(base, 0, 0); this.seg(sx, sy, x, y, s, false); break;
      case 'rect': this.ctx.putImageData(base, 0, 0); this.box(sx, sy, x, y, s, false); break;
      case 'frect': this.ctx.putImageData(base, 0, 0); this.box(sx, sy, x, y, s, true); break;
      case 'oval': this.ctx.putImageData(base, 0, 0); this.oval(sx, sy, x, y, s); break;
    }
  }
}
if (!customElements.get('paint-app')) customElements.define('paint-app', PaintApp);
