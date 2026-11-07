// <mine-sweeper>: the classic, as a custom element, so it also works inside windows adopted from other pages.
type Cell = { mine: boolean; open: boolean; flag: boolean; n: number };
const LEVELS = {
  beginner: { r: 9, c: 9, m: 10, name: 'Beginner' },
  intermediate: { r: 16, c: 16, m: 40, name: 'Intermediate' },
  expert: { r: 16, c: 30, m: 99, name: 'Expert' },
} as const;
type Level = keyof typeof LEVELS;

const svg = (body: string) => `<svg viewBox="0 0 16 16" width="16" height="16" shape-rendering="crispEdges" aria-hidden="true">${body}</svg>`;
const MINE = svg('<rect x="7" y="2" width="2" height="12"/><rect x="2" y="7" width="12" height="2"/><rect x="4" y="4" width="8" height="8"/><rect x="5" y="3" width="6" height="10"/><rect x="3" y="5" width="10" height="6"/><rect x="5" y="5" width="2" height="2" fill="#fff"/>');
const FLAG = svg('<rect x="4" y="12" width="8" height="2"/><rect x="6" y="11" width="4" height="1"/><rect x="8" y="3" width="1" height="9"/><rect x="4" y="5" width="4" height="2" fill="#f00"/><rect x="6" y="3" width="2" height="5" fill="#f00"/><rect x="5" y="4" width="1" height="3" fill="#f00"/>');
const face = (mouth: string, eyes = '<rect x="5" y="5" width="2" height="2"/><rect x="9" y="5" width="2" height="2"/>') =>
  svg(`<rect x="4" y="1" width="8" height="14" fill="#ff0"/><rect x="2" y="3" width="12" height="10" fill="#ff0"/><rect x="1" y="4" width="14" height="8" fill="#ff0"/>
  <rect x="4" y="0" width="8" height="1"/><rect x="4" y="15" width="8" height="1"/><rect x="0" y="4" width="1" height="8"/><rect x="15" y="4" width="1" height="8"/>
  <rect x="2" y="1" width="2" height="1"/><rect x="12" y="1" width="2" height="1"/><rect x="1" y="2" width="1" height="2"/><rect x="14" y="2" width="1" height="2"/>
  <rect x="2" y="14" width="2" height="1"/><rect x="12" y="14" width="2" height="1"/><rect x="1" y="12" width="1" height="2"/><rect x="14" y="12" width="1" height="2"/>${eyes}${mouth}`);
const FACES = {
  smile: face('<rect x="5" y="10" width="1" height="1"/><rect x="10" y="10" width="1" height="1"/><rect x="6" y="11" width="4" height="1"/>'),
  ooh: face('<rect x="7" y="9" width="2" height="3"/><rect x="6" y="10" width="4" height="1"/>'),
  dead: face('<rect x="6" y="11" width="4" height="1"/><rect x="5" y="12" width="1" height="1"/><rect x="10" y="12" width="1" height="1"/>',
    '<rect x="4" y="4" width="1" height="1"/><rect x="6" y="4" width="1" height="1"/><rect x="5" y="5" width="1" height="1"/><rect x="4" y="6" width="1" height="1"/><rect x="6" y="6" width="1" height="1"/><rect x="9" y="4" width="1" height="1"/><rect x="11" y="4" width="1" height="1"/><rect x="10" y="5" width="1" height="1"/><rect x="9" y="6" width="1" height="1"/><rect x="11" y="6" width="1" height="1"/>'),
  cool: face('<rect x="5" y="10" width="1" height="1"/><rect x="10" y="10" width="1" height="1"/><rect x="6" y="11" width="4" height="1"/>',
    '<rect x="3" y="5" width="10" height="1"/><rect x="4" y="5" width="3" height="2"/><rect x="9" y="5" width="3" height="2"/>'),
};
const store = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch {} },
};

class MineSweeper extends HTMLElement {
  level: Level = 'beginner';
  cells: Cell[] = [];
  btns: HTMLButtonElement[] = [];
  started = false; over = false; opened = 0; flags = 0; t0 = 0; timer = 0; cursor = 0;
  grid!: HTMLElement; mineLed!: HTMLElement; timeLed!: HTMLElement; faceBtn!: HTMLButtonElement; best!: HTMLElement; levelSel!: HTMLSelectElement;
  press = 0; suppress = false;

  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = '1';
    const saved = store.get('ms-level') as Level | null;
    if (saved && saved in LEVELS) this.level = saved;
    else if (matchMedia('(max-width: 700px)').matches) this.level = 'beginner';
    this.innerHTML = `
      <div class="ms-bar field-row"><label for="ms-l-${this.id}">Game</label>
        <select id="ms-l-${this.id}">${Object.entries(LEVELS).map(([k, v]) => `<option value="${k}">${v.name}</option>`).join('')}</select></div>
      <div class="ms-frame">
        <div class="ms-top"><span class="ms-led" aria-label="Mines left"></span><button type="button" class="ms-face" aria-label="New game"></button><span class="ms-led" aria-label="Seconds"></span></div>
        <div class="ms-grid" role="grid" aria-label="Minefield"></div>
      </div>
      <p class="ms-best" aria-live="polite"></p>`;
    this.levelSel = this.querySelector('select')!;
    this.levelSel.value = this.level;
    [this.mineLed, this.timeLed] = [...this.querySelectorAll<HTMLElement>('.ms-led')];
    this.faceBtn = this.querySelector('.ms-face')!;
    this.grid = this.querySelector('.ms-grid')!;
    this.best = this.querySelector('.ms-best')!;
    this.levelSel.addEventListener('change', () => { this.level = this.levelSel.value as Level; store.set('ms-level', this.level); this.reset(); });
    this.faceBtn.addEventListener('click', () => this.reset());
    this.grid.addEventListener('click', (e) => { const i = this.idx(e); if (i < 0) return; if (this.suppress) { this.suppress = false; return; } this.cells[i].open ? this.chord(i) : this.reveal(i); });
    this.grid.addEventListener('contextmenu', (e) => { const i = this.idx(e); if (i < 0) return; e.preventDefault(); this.toggleFlag(i); });
    this.grid.addEventListener('pointerdown', (e) => {
      const i = this.idx(e); if (i < 0 || this.over) return;
      if (e.button === 0) this.setFace('ooh');
      if (e.pointerType !== 'mouse') {
        clearTimeout(this.press);
        this.press = window.setTimeout(() => { this.toggleFlag(i); this.suppress = true; navigator.vibrate?.(15); }, 380);
      }
    });
    const up = () => { clearTimeout(this.press); if (!this.over) this.setFace('smile'); };
    this.grid.addEventListener('pointerup', up); this.grid.addEventListener('pointerleave', up); this.grid.addEventListener('pointercancel', up);
    this.grid.addEventListener('keydown', (e) => this.key(e));
    this.reset();
  }
  disconnectedCallback() { clearInterval(this.timer); }

  get L() { return LEVELS[this.level]; }
  idx(e: Event) { const b = (e.target as Element).closest<HTMLButtonElement>('.ms-cell'); return b ? Number(b.dataset.i) : -1; }
  around(i: number) {
    const { r, c } = this.L, y = Math.floor(i / c), x = i % c, out: number[] = [];
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const yy = y + dy, xx = x + dx;
      if (yy >= 0 && yy < r && xx >= 0 && xx < c) out.push(yy * c + xx);
    }
    return out;
  }
  led(el: HTMLElement, n: number) { el.textContent = (n < 0 ? '-' + String(Math.min(99, -n)).padStart(2, '0') : String(Math.min(999, n)).padStart(3, '0')); }
  setFace(f: keyof typeof FACES) { this.faceBtn.innerHTML = FACES[f]; }

  reset() {
    clearInterval(this.timer);
    const { r, c, m } = this.L;
    this.cells = Array.from({ length: r * c }, () => ({ mine: false, open: false, flag: false, n: 0 }));
    this.started = false; this.over = false; this.opened = 0; this.flags = 0; this.cursor = 0;
    this.grid.style.setProperty('--cols', String(c));
    this.grid.innerHTML = '';
    this.btns = this.cells.map((_, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'ms-cell'; b.dataset.i = String(i);
      b.tabIndex = i === 0 ? 0 : -1;
      b.setAttribute('aria-label', `Row ${Math.floor(i / c) + 1}, column ${(i % c) + 1}, hidden`);
      this.grid.appendChild(b);
      return b;
    });
    this.led(this.mineLed, m); this.led(this.timeLed, 0); this.setFace('smile');
    const best = store.get(`ms-best-${this.level}`);
    this.best.textContent = best ? `Best ${this.L.name} time: ${best} s` : `${this.L.name}: ${m} mines. Right-click or long-press to flag.`;
  }
  plant(safe: number) {
    const { m } = this.L, keep = new Set([safe, ...this.around(safe)]);
    const free = this.cells.map((_, i) => i).filter((i) => !keep.has(i));
    for (let k = 0; k < m; k++) { const j = k + Math.floor(Math.random() * (free.length - k)); [free[k], free[j]] = [free[j], free[k]]; this.cells[free[k]].mine = true; }
    this.cells.forEach((cell, i) => (cell.n = this.around(i).filter((j) => this.cells[j].mine).length));
    this.started = true; this.t0 = Date.now();
    this.timer = window.setInterval(() => this.led(this.timeLed, Math.floor((Date.now() - this.t0) / 1000)), 250);
  }
  paint(i: number) {
    const cell = this.cells[i], b = this.btns[i], { c } = this.L;
    const where = `Row ${Math.floor(i / c) + 1}, column ${(i % c) + 1}`;
    b.classList.toggle('open', cell.open);
    if (cell.open) {
      b.innerHTML = cell.mine ? MINE : cell.n ? String(cell.n) : '';
      b.dataset.n = String(cell.n);
      b.setAttribute('aria-label', `${where}, ${cell.mine ? 'mine' : cell.n ? cell.n : 'empty'}`);
    } else {
      b.innerHTML = cell.flag ? FLAG : '';
      b.setAttribute('aria-label', `${where}, ${cell.flag ? 'flagged' : 'hidden'}`);
    }
  }
  reveal(i: number) {
    if (this.over || this.cells[i].flag || this.cells[i].open) return;
    if (!this.started) this.plant(i);
    if (this.cells[i].mine) return this.lose(i);
    const stack = [i];
    while (stack.length) {
      const j = stack.pop()!, cell = this.cells[j];
      if (cell.open || cell.flag) continue;
      cell.open = true; this.opened++; this.paint(j);
      if (cell.n === 0) stack.push(...this.around(j).filter((k) => !this.cells[k].open));
    }
    const { r, c, m } = this.L;
    if (this.opened === r * c - m) this.win();
  }
  chord(i: number) {
    const cell = this.cells[i];
    if (this.over || !cell.n) return;
    const nb = this.around(i);
    if (nb.filter((j) => this.cells[j].flag).length !== cell.n) return;
    nb.forEach((j) => this.reveal(j));
  }
  toggleFlag(i: number) {
    const cell = this.cells[i];
    if (this.over || cell.open) return;
    cell.flag = !cell.flag; this.flags += cell.flag ? 1 : -1;
    this.led(this.mineLed, this.L.m - this.flags); this.paint(i);
  }
  lose(i: number) {
    this.over = true; clearInterval(this.timer); this.setFace('dead');
    this.cells.forEach((cell, j) => {
      if (cell.mine && !cell.flag) { cell.open = true; this.paint(j); }
      if (!cell.mine && cell.flag) this.btns[j].classList.add('wrong');
    });
    this.btns[i].classList.add('boom');
    this.best.textContent = 'Boom. Click the face to try again.';
  }
  win() {
    this.over = true; clearInterval(this.timer); this.setFace('cool');
    this.cells.forEach((cell, j) => { if (cell.mine && !cell.flag) { cell.flag = true; this.paint(j); } });
    this.led(this.mineLed, 0);
    const s = Math.max(1, Math.round((Date.now() - this.t0) / 1000));
    const key = `ms-best-${this.level}`, prev = Number(store.get(key) || Infinity);
    if (s < prev) store.set(key, String(s));
    this.best.textContent = s < prev ? `Cleared in ${s} s. New best!` : `Cleared in ${s} s. Best is still ${prev} s.`;
  }
  key(e: KeyboardEvent) {
    const i = this.idx(e); if (i < 0) return;
    const { r, c } = this.L, y = Math.floor(i / c), x = i % c;
    const moves: Record<string, number> = { ArrowLeft: x > 0 ? i - 1 : i, ArrowRight: x < c - 1 ? i + 1 : i, ArrowUp: y > 0 ? i - c : i, ArrowDown: y < r - 1 ? i + c : i };
    if (e.key in moves) {
      e.preventDefault();
      this.btns[i].tabIndex = -1; const n = moves[e.key]; this.btns[n].tabIndex = 0; this.btns[n].focus();
    } else if (e.key === 'f' || e.key === 'F') { e.preventDefault(); this.toggleFlag(i); }
  }
}
if (!customElements.get('mine-sweeper')) customElements.define('mine-sweeper', MineSweeper);
