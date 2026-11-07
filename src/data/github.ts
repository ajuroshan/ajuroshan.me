// GitHub's public contribution calendar, read at build time from the page github.com uses itself.
export type Day = { date: string; level: number; count: number };
export type Calendar = { weeks: Day[][]; total: number; ok: boolean };

export async function getCalendar(user: string): Promise<Calendar> {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 8000);
    const r = await fetch(`https://github.com/users/${user}/contributions`, { signal: ctl.signal, headers: { 'User-Agent': 'ajmalroshan.dev build' } });
    clearTimeout(t);
    if (!r.ok) throw new Error(String(r.status));
    const html = await r.text();
    const tips = new Map<string, number>();
    for (const m of html.matchAll(/for="(contribution-day-component-\d+-\d+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
      const n = /^(\d+) contribution/.exec(m[2]);
      tips.set(m[1], n ? Number(n[1]) : 0);
    }
    const days: (Day & { w: number; d: number })[] = [];
    for (const m of html.matchAll(/<td[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="(contribution-day-component-(\d+)-(\d+))"[^>]*data-level="(\d)"/g)) {
      days.push({ date: m[1], level: Number(m[5]), count: tips.get(m[2]) ?? 0, d: Number(m[3]), w: Number(m[4]) });
    }
    if (days.length < 300) throw new Error('unexpected markup');
    const weeks: Day[][] = [];
    for (const x of days.sort((a, b) => a.date.localeCompare(b.date))) {
      (weeks[x.w] ??= [])[x.d] = { date: x.date, level: x.level, count: x.count };
    }
    return { weeks: weeks.filter(Boolean), total: days.reduce((s, x) => s + x.count, 0), ok: true };
  } catch {
    return { weeks: [], total: 0, ok: false };
  }
}
