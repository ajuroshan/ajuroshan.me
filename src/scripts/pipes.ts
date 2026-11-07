// 3D Pipes, the Windows screensaver. Starts after 20 s without input; any input dismisses it.
const IDLE_MS = 20_000;
const COLORS = ['#c00000', '#00a000', '#0040ff', '#d0d000', '#00b0b0', '#c000c0', '#c0c0c0', '#ff8000'];
const N = 14;               // grid cells per side
const MAX_SEGMENTS = 520;   // then clear and start over, as the original did

type V = [number, number, number];
const DIRS: V[] = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];

function shade(hex: string, f: number) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (s: number) => Math.max(0, Math.min(255, Math.round(((n >> s) & 255) * f)));
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
}

class Pipes {
  canvas = document.createElement('canvas');
  ctx = this.canvas.getContext('2d')!;
  used = new Set<string>();
  raf = 0; last = 0; segments = 0;
  pipes: { pos: V; dir: V; color: string; alive: boolean }[] = [];
  pos: V = [0, 0, 0]; dir: V = [1, 0, 0]; color = COLORS[0]; alive = false;
  w = 0; h = 0; yaw = 0; pitch = 0;

  constructor() {
    this.canvas.className = 'screensaver';
    this.canvas.setAttribute('aria-hidden', 'true');
  }
  start() {
    document.body.appendChild(this.canvas);
    this.resize(); this.clear();
    this.last = performance.now();
    this.raf = requestAnimationFrame((t) => this.tick(t));
  }
  stop() { cancelAnimationFrame(this.raf); this.canvas.remove(); }
  resize() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    this.w = innerWidth; this.h = innerHeight;
    this.canvas.width = this.w * dpr; this.canvas.height = this.h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  clear() {
    this.ctx.fillStyle = '#000'; this.ctx.fillRect(0, 0, this.w, this.h);
    this.used.clear(); this.segments = 0; this.alive = false;
    const n = 2 + Math.floor(Math.random() * 3);
    this.pipes = Array.from({ length: n }, () => ({ pos: [0, 0, 0] as V, dir: [1, 0, 0] as V, color: COLORS[0], alive: false }));
    this.yaw = (Math.random() - 0.5) * 0.9; this.pitch = (Math.random() - 0.5) * 0.6;
  }
  key(p: V) { return p.join(','); }
  free(p: V) { return p.every((c) => c >= 0 && c < N) && !this.used.has(this.key(p)); }
  project(p: V) {
    // centre the grid, rotate a little, perspective
    let [x, y, z] = p.map((c) => c - (N - 1) / 2) as V;
    const cy = Math.cos(this.yaw), sy = Math.sin(this.yaw), cp = Math.cos(this.pitch), sp = Math.sin(this.pitch);
    [x, z] = [x * cy - z * sy, x * sy + z * cy];
    [y, z] = [y * cp - z * sp, y * sp + z * cp];
    const d = N * 1.9, s = (Math.min(this.w, this.h) * 1.05) / (d + z) * (N / 10.5);
    return { x: this.w / 2 + x * s, y: this.h / 2 - y * s, r: s * 0.22 };
  }
  ball(p: V, k = 1.35) {
    const q = this.project(p), r = q.r * k, g = this.ctx.createRadialGradient(q.x - r * 0.35, q.y - r * 0.35, r * 0.1, q.x, q.y, r);
    g.addColorStop(0, shade(this.color, 1.9)); g.addColorStop(0.35, this.color); g.addColorStop(1, shade(this.color, 0.25));
    this.ctx.fillStyle = g; this.ctx.beginPath(); this.ctx.arc(q.x, q.y, r, 0, Math.PI * 2); this.ctx.fill();
  }
  tube(a: V, b: V) {
    const p = this.project(a), q = this.project(b), r = (p.r + q.r) / 2;
    const dx = q.x - p.x, dy = q.y - p.y, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
    const g = this.ctx.createLinearGradient(p.x + nx * r, p.y + ny * r, p.x - nx * r, p.y - ny * r);
    g.addColorStop(0, shade(this.color, 0.25)); g.addColorStop(0.3, this.color); g.addColorStop(0.45, shade(this.color, 1.8));
    g.addColorStop(0.6, this.color); g.addColorStop(1, shade(this.color, 0.2));
    this.ctx.strokeStyle = g; this.ctx.lineWidth = r * 2; this.ctx.lineCap = 'square';
    this.ctx.beginPath(); this.ctx.moveTo(p.x, p.y); this.ctx.lineTo(q.x, q.y); this.ctx.stroke();
  }
  spawn() {
    for (let tries = 0; tries < 40; tries++) {
      const p: V = [0, 0, 0].map(() => Math.floor(Math.random() * N)) as V;
      if (this.free(p)) {
        this.pos = p; this.used.add(this.key(p)); this.alive = true;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.dir = DIRS[Math.floor(Math.random() * 6)];
        this.ball(p, 1.15);
        return true;
      }
    }
    return false;
  }
  stepAll() {
    for (const pp of this.pipes) {
      this.pos = pp.pos; this.dir = pp.dir; this.color = pp.color; this.alive = pp.alive;
      const before = this.segments;
      this.step();
      if (this.segments < before) return;   // cleared
      pp.pos = this.pos; pp.dir = this.dir; pp.color = this.color; pp.alive = this.alive;
    }
  }
  step() {
    if (!this.alive && !this.spawn()) return this.clear();
    const options = DIRS.filter((d) => this.free(this.pos.map((c, i) => c + d[i]) as V));
    if (!options.length) { this.alive = false; return; }
    const keep = options.find((d) => d === this.dir);
    const turn = !keep || Math.random() < 0.28;
    const d = turn ? options[Math.floor(Math.random() * options.length)] : keep!;
    const next = this.pos.map((c, i) => c + d[i]) as V;
    if (d !== this.dir) this.ball(this.pos);
    this.tube(this.pos, next);
    this.used.add(this.key(next)); this.pos = next; this.dir = d;
    if (++this.segments >= MAX_SEGMENTS) this.clear();
  }
  tick(t: number) {
    const steps = Math.min(6, Math.floor((t - this.last) / 60));
    if (steps > 0) { for (let i = 0; i < steps; i++) this.stepAll(); this.last = t; }
    this.raf = requestAnimationFrame((tt) => this.tick(tt));
  }
}

export function initScreensaver() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const saver = new Pipes();
  let on = false, timer = 0, armedAt = 0;
  const arm = () => { clearTimeout(timer); timer = window.setTimeout(show, IDLE_MS); };
  const show = () => { if (document.hidden || document.body.classList.contains('playing')) return arm(); on = true; armedAt = performance.now(); saver.start(); };
  const wake = () => {
    if (on) {
      if (performance.now() - armedAt < 300) return;   // ignore the event that may have raced the start
      on = false; saver.stop();
    }
    arm();
  };
  for (const ev of ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll']) addEventListener(ev, wake, { passive: true, capture: true });
  addEventListener('resize', () => { if (on) { saver.resize(); saver.clear(); } });
  document.addEventListener('visibilitychange', () => { if (document.hidden && on) { on = false; saver.stop(); } arm(); });
  arm();
}
