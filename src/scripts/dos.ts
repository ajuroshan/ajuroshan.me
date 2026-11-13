// <dos-prompt>: a small MS-DOS Prompt. Data (notes, projects, contact) comes from the data-fs attribute,
// so it works the same inside a window adopted from another page.
type Note = { id: string; title: string; date: string; description: string; tags: string[] };
type Project = { slug: string; name: string; kind: string; year: number; summary: string; url?: string; repo?: string };
type FS = { notes: Note[]; projects: Project[]; email: string; github: string; version: string };

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const pad = (s: string, n: number) => (s.length >= n ? s.slice(0, n) : s + ' '.repeat(n - s.length));
const dosName = (s: string) => s.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 8);
const COLORS: Record<string, string> = { '0': '#000', '1': '#0000aa', '2': '#00aa00', '3': '#00aaaa', '4': '#aa0000', '5': '#aa00aa', '6': '#aa5500', '7': '#aaaaaa', '8': '#555', '9': '#5555ff', a: '#55ff55', b: '#55ffff', c: '#ff5555', d: '#ff55ff', e: '#ffff55', f: '#fff' };

class DosPrompt extends HTMLElement {
  fs!: FS;
  cwd = 'C:\\';
  out!: HTMLElement;
  input!: HTMLInputElement;
  promptEl!: HTMLElement;
  history: string[] = [];
  hpos = 0;

  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = '1';
    try { this.fs = JSON.parse(this.dataset.fs || '{}'); } catch { this.fs = { notes: [], projects: [], email: '', github: '', version: '' }; }
    this.innerHTML = `<div class="dos-screen" tabindex="-1"><div class="dos-out" aria-live="polite"></div><label class="dos-line"><span class="dos-ps"></span><input class="dos-in" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Command" enterkeyhint="go"></label></div>`;
    this.out = this.querySelector('.dos-out')!;
    this.input = this.querySelector('.dos-in')!;
    this.promptEl = this.querySelector('.dos-ps')!;
    this.querySelector('.dos-screen')!.addEventListener('click', () => { if (!getSelection()?.toString()) this.input.focus({ preventScroll: true }); });
    this.input.addEventListener('keydown', (e) => this.key(e));
    this.print(`Microsoft(R) Windows 98
   (C)Copyright Microsoft Corp 1981-1999.
   (C)Copyright Ajmal Roshan 2026, all the bugs reserved.

Type <b>help</b> to see what this thing can do.
`);
    this.setPrompt();
  }

  setPrompt() { this.promptEl.textContent = `${this.cwd}>`; }
  print(html = '') { const d = document.createElement('div'); d.className = 'dos-row'; d.innerHTML = html; this.out.appendChild(d); this.scroll(); }
  text(s = '') { this.print(esc(s)); }
  scroll() { const sc = this.querySelector('.dos-screen')!; sc.scrollTop = sc.scrollHeight; }
  link(href: string, label: string) { return `<a href="${esc(href)}">${esc(label)}</a>`; }

  key(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      const cmd = this.input.value;
      this.input.value = '';
      this.text(`${this.cwd}>${cmd}`);
      if (cmd.trim()) { this.history.push(cmd); this.hpos = this.history.length; }
      this.run(cmd.trim()).finally(() => { this.setPrompt(); this.scroll(); });
    } else if (e.key === 'ArrowUp') {
      if (this.hpos > 0) { this.hpos--; this.input.value = this.history[this.hpos]; }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      this.hpos = Math.min(this.history.length, this.hpos + 1);
      this.input.value = this.history[this.hpos] ?? '';
      e.preventDefault();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const v = this.input.value, parts = v.split(' '), last = (parts.pop() || '').toLowerCase();
      const pool = parts.length ? this.names() : Object.keys(this.commands());
      const hit = pool.find((n) => n.toLowerCase().startsWith(last));
      if (hit) this.input.value = [...parts, parts.length ? hit : hit.toLowerCase()].join(' ');
    } else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); this.out.innerHTML = ''; }
  }

  dirs() { return { NOTES: this.fs.notes.map((n) => dosName(n.id) + '.TXT'), WORK: this.fs.projects.map((p) => dosName(p.slug) + '.TXT'), GAMES: ['WINMINE.EXE'] } as Record<string, string[]>; }
  names() { return [...Object.keys(this.dirs()), 'README.TXT', ...Object.values(this.dirs()).flat()]; }
  here() { return this.cwd === 'C:\\' ? null : this.cwd.slice(3); }

  commands(): Record<string, (args: string[]) => void | Promise<void>> {
    return {
      help: () => this.print(`These commands are available:

  <b>DIR</b>         list what's here          <b>CD</b> &lt;dir&gt;     NOTES, WORK, GAMES, ..
  <b>TYPE</b> &lt;file&gt; read a file               <b>START</b> &lt;app&gt;  open a window (notes, work, paint...)
  <b>WHOAMI</b>      who built this            <b>CONTACT</b>     how to reach me
  <b>VER</b>         version                   <b>DATE</b> / <b>TIME</b> what it says
  <b>COLOR</b> &lt;xy&gt;  change colours (try 0a)  <b>CLS</b>         clear the screen
  <b>EXIT</b>        close this window

Up/Down for history, Tab to complete. There may be a few others.`),
      cls: () => { this.out.innerHTML = ''; },
      ver: () => this.text(`\nWindows 98 [Version 4.10.1998]\najmalroshan.dev ${this.fs.version}\n`),
      date: () => this.text(`Current date is ${new Date().toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}`),
      time: () => this.text(`Current time is ${new Date().toLocaleTimeString('en-GB')}`),
      whoami: () => this.print(`ajmal\\roshan

Engineer in Kochi. Builds things at Althio. Wrote the software a university runs its admissions on, and a dashboard for his motorcycle. Thinks Minesweeper on Expert is a personality.`),
      contact: () => this.print(`Email   ${this.link('mailto:' + this.fs.email, this.fs.email)}
GitHub  ${this.link('https://github.com/' + this.fs.github, 'github.com/' + this.fs.github)}`),
      echo: (a) => this.text(a.join(' ')),
      cd: (a) => {
        const t = (a[0] || '').toUpperCase().replace(/\\$/, '');
        if (!t) return this.text(this.cwd);
        if (t === '..' || t === '\\' || t === 'C:\\' || t === 'C:') { this.cwd = 'C:\\'; return; }
        if (t in this.dirs() && !this.here()) { this.cwd = `C:\\${t}`; return; }
        this.text('Invalid directory');
      },
      dir: (a) => {
        const d = this.here() || (a[0] || '').toUpperCase();
        const list = d && this.dirs()[d];
        this.text(`\n Volume in drive C is AJMALROSHAN\n Directory of C:\\${d || ''}\n`);
        if (list) {
          this.text(pad('.', 13) + '<DIR>'); this.text(pad('..', 13) + '<DIR>');
          list.forEach((f) => this.text(pad(f, 13) + pad('', 6) + '07/11/2026'));
          this.text(`     ${list.length} file(s)`);
        } else {
          Object.keys(this.dirs()).forEach((k) => this.text(pad(k, 13) + '<DIR>'));
          this.text(pad('README.TXT', 13) + pad('', 6) + '07/11/2026');
          this.text(pad('AUTOEXEC.BAT', 13) + pad('', 6) + '07/11/2026');
          this.text(`     2 file(s)    3 dir(s)   ∞ bytes free`);
        }
        this.text('');
      },
      type: (a) => {
        const f = (a[0] || '').toUpperCase();
        if (!f) return this.text('Required parameter missing');
        if (f === 'README.TXT') return this.print(`Hi! This is ajmalroshan.dev, a Windows 98 desktop that's actually a website.
Everything opens in a window. Try ${this.link('/games/minesweeper/', 'Minesweeper')}, or wait 20 seconds.`);
        if (f === 'AUTOEXEC.BAT') return this.text('@ECHO OFF\nSET COFFEE=REQUIRED\nWIN');
        const n = this.fs.notes.find((x) => dosName(x.id) + '.TXT' === f || dosName(x.id) === f);
        if (n) return this.print(`<b>${esc(n.title)}</b>  (${esc(n.date)})\n${esc(n.description)}\n\nRead it: ${this.link('/blog/' + n.id + '/', '/blog/' + n.id + '/')}`);
        const p = this.fs.projects.find((x) => dosName(x.slug) + '.TXT' === f || dosName(x.slug) === f);
        if (p) return this.print(`<b>${esc(p.name)}</b>  (${esc(p.kind)}, ${p.year})\n${esc(p.summary)}\n\nMore: ${this.link('/projects/#' + p.slug, 'Properties')}${p.url ? '  ' + this.link(p.url, p.url) : ''}${p.repo ? '  ' + this.link(p.repo, 'source') : ''}`);
        this.text('File not found');
      },
      start: (a) => {
        const t = (a[0] || '').toLowerCase().replace(/\.exe$/, '');
        const map: Record<string, string> = { notes: '/blog/', work: '/projects/', winmine: '/games/minesweeper/', minesweeper: '/games/minesweeper/', activity: '/activity/', readme: '/#welcome', welcome: '/#welcome', paint: '/apps/paint/', pbrush: '/apps/paint/', display: '/apps/display/', desk: '/apps/display/' };
        const href = map[t] ?? (this.fs.notes.find((n) => n.id.startsWith(t)) ? `/blog/${this.fs.notes.find((n) => n.id.startsWith(t))!.id}/` : '');
        if (!href) return this.text(`Bad command or file name`);
        const l = document.createElement('a'); l.href = href; l.hidden = true; document.body.appendChild(l); l.click(); l.remove();
      },
      winmine: () => this.commands().start(['winmine']),
      ping: () => this.text('Pinging the internet... still there. Good.'),
      color: (a) => {
        const [bg, fg] = (a[0] || '07').toLowerCase().split('');
        if (!(bg in COLORS) || !(fg in COLORS) || bg === fg) return this.text('Usage: COLOR <background><foreground>, e.g. COLOR 0A for green on black');
        const scr = this.querySelector<HTMLElement>('.dos-screen')!;
        scr.style.setProperty('--dos-bg', COLORS[bg]); scr.style.setProperty('--dos-fg', COLORS[fg]);
      },
      exit: () => { this.closest('[data-win]')?.querySelector<HTMLButtonElement>('[data-close]')?.click(); },
      // the others
      sudo: () => this.text("ajmal is not in the sudoers file. This incident will be reported. (It's DOS, there is no sudo.)"),
      rm: () => this.text("Nice try. This is DOS. And no."),
      deltree: () => this.text('Delete directory "C:\\" and all its subdirectories? [yn] n\nGood call.'),
      format: () => this.text('WARNING, ALL DATA ON NON-REMOVABLE DISK DRIVE C: WILL BE LOST!\nProceed with Format (Y/N)? N\nPhew.'),
      win: () => this.text("You're already in Windows. Look behind this window."),
      hello: () => this.text('Hi! Type help if you are lost.'),
      hi: () => this.text('Hello! Type help if you are lost.'),
      coffee: () => this.text('Error 418: I am a teapot. Ask again after 7 am.'),
      ls: () => { this.text("'ls' is a Unix thing. Here you say DIR. I'll allow it:"); return this.commands().dir([]); },
      clear: () => { this.out.innerHTML = ''; },
      pwd: () => this.text(this.cwd),
      cat: (a) => this.commands().type(a),
      vim: () => this.text("You're safe here. There is no vim, so you can't get stuck in it."),
      matrix: () => { this.commands().color(['0a']); this.text('Wake up, Neo...'); },
    };
  }

  async run(line: string) {
    if (!line) return;
    const [raw, ...args] = line.split(/\s+/);
    let name = raw.toLowerCase();
    if (/^[a-z]:$/.test(name)) return this.text(name === 'c:' ? '' : `Not ready reading drive ${name.toUpperCase()}\nAbort, Retry, Fail?`);
    if (name === 'cd..') { name = 'cd'; args.unshift('..'); }
    const cmd = this.commands()[name];
    if (!cmd) {
      if (name.endsWith('.exe') && this.commands()[name.slice(0, -4)]) return this.commands()[name.slice(0, -4)](args);
      return this.text('Bad command or file name');
    }
    await cmd(args);
  }
}
if (!customElements.get('dos-prompt')) customElements.define('dos-prompt', DosPrompt);
