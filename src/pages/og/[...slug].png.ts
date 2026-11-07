// Open Graph images: a Windows-style dialog rendered from SVG at build time.
import { Resvg } from '@resvg/resvg-js';
import { getCollection } from 'astro:content';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { APIContext } from 'astro';
import { site } from '../../data/profile';

const font = readFileSync(resolve(process.cwd(), 'src/assets/fonts/hanken-grotesk-500.ttf'));

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return [
    { params: { slug: 'default' }, props: { title: 'Ajmal Roshan', sub: site.tagline, bar: 'Welcome' } },
    ...posts.map((p) => ({ params: { slug: p.id }, props: { title: p.data.title, sub: p.data.description, bar: `${p.id}.md - Notepad` } })),
  ];
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function wrap(text: string, max: number, maxLines: number): string[] {
  const words = text.split(/\s+/); const lines: string[] = []; let cur = '';
  for (const w of words) { if ((cur + ' ' + w).trim().length > max && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) { lines.length = maxLines; lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, '') + '…'; }
  return lines;
}
// 3D bevel as in the 90s: light top-left, dark bottom-right
const bevel = (x: number, y: number, w: number, h: number, light = '#fff', dark = '#808080', black = '#0a0a0a') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#c0c0c0"/><path d="M${x} ${y + h - 1}V${y}h${w - 1}" stroke="${light}" stroke-width="2" fill="none"/><path d="M${x + w - 1} ${y}v${h - 1}H${x}" stroke="${black}" stroke-width="2" fill="none"/><path d="M${x + w - 3} ${y + 2}v${h - 5}H${x + 2}" stroke="${dark}" stroke-width="2" fill="none"/>`;

export function GET({ props }: APIContext) {
  const { title, sub, bar } = props as { title: string; sub: string; bar: string };
  const size = title.length > 34 ? 54 : 68;
  const tl = wrap(title, title.length > 34 ? 34 : 26, 2);
  const sl = wrap(sub, 64, 3);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#008080"/>
  ${bevel(90, 85, 1020, 460)}
  <rect x="97" y="92" width="1006" height="36" fill="#000080"/>
  <rect x="97" y="92" width="1006" height="36" fill="url(#g)"/>
  <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#000080"/><stop offset="1" stop-color="#1084d0"/></linearGradient></defs>
  <text x="112" y="118" font-family="Hanken Grotesk" font-size="22" font-weight="500" fill="#fff">${esc(bar)}</text>
  ${bevel(1058, 98, 34, 24)}<text x="1067" y="116" font-family="Hanken Grotesk" font-size="20" fill="#000">×</text>
  ${tl.map((l, i) => `<text x="130" y="${215 + i * size * 1.1}" font-family="Hanken Grotesk" font-size="${size}" font-weight="500" fill="#000">${esc(l)}</text>`).join('')}
  ${sl.map((l, i) => `<text x="130" y="${400 + i * 34}" font-family="Hanken Grotesk" font-size="26" fill="#222">${esc(l)}</text>`).join('')}
  ${bevel(930, 480, 150, 42)}<text x="1005" y="508" text-anchor="middle" font-family="Hanken Grotesk" font-size="22" fill="#000">OK</text>
  <text x="130" y="508" font-family="Hanken Grotesk" font-size="22" fill="#222">${esc(site.domain)}</text>
</svg>`;
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 }, font: { fontBuffers: [font], loadSystemFonts: false, defaultFontFamily: 'Hanken Grotesk' } }).render().asPng();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
}
