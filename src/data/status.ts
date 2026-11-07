// A snapshot of /status.json, fetched at build time so the HTML carries real numbers
// without JavaScript. The page refreshes it in the browser every minute.
import fallback from './status.fallback.json';

export type Status = typeof fallback;

export async function getStatus(): Promise<Status> {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 4000);
    const r = await fetch('https://ajmalroshan.dev/status.json', { signal: ctl.signal });
    clearTimeout(t);
    if (!r.ok) throw new Error(String(r.status));
    const s = (await r.json()) as Status;
    if (!Array.isArray(s.services)) throw new Error('bad shape');
    return s;
  } catch {
    return fallback;
  }
}

export const uptime = (s: number) => (s < 86400 ? `${Math.floor(s / 3600)} h` : `${Math.floor(s / 86400)} d`);

export function since(iso: string, now = new Date()): string {
  const ms = now.getTime() - new Date(iso).getTime();
  const m = Math.max(0, Math.round(ms / 60000));
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h} h`;
  return `${Math.floor(h / 24)} d`;
}

export function ist(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
}
