// The visitor count, fetched at build time so the HTML carries a real number; the page refreshes it.
export async function getVisitors(): Promise<number | null> {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 4000);
    const r = await fetch('https://ajmalroshan.dev/visitors.json', { signal: ctl.signal });
    clearTimeout(t);
    if (!r.ok) return null;
    const v = (await r.json())?.visitors;
    return typeof v === 'number' ? v : null;
  } catch {
    return null;
  }
}
