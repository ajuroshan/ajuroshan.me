# ajmalroshan.dev

Personal site of Ajmal Roshan: a late-90s desktop in the browser. Astro (static) + nginx on the OCI always-free ARM VM `arm-free-01`, behind a Cloudflare tunnel.

```bash
npm i
npm run dev        # http://localhost:4321
npm run build && npm run preview
```

## Where things are

- Words about me, projects, services: `src/data/profile.ts`
- Notes: `src/content/blog/*.md` (frontmatter: `title`, `description`, `date`, optional `updated`, `tags`, `draft`)
- Windows, taskbar, Start menu: `src/components/Window.astro`, `src/layouts/Base.astro`
- Pixel icons (16×16 maps in text, emitted as SVG): `src/components/Icon.astro`
- Widgets: `src/styles/98.css` (98.css v0.1.21 by Jordan Scales, MIT, one media query patched for lightningcss)
- SEO: `src/components/Seo.astro` (canonical, Open Graph, Twitter, JSON-LD), sitemap, RSS at `/rss.xml`, OG images rendered at build in `src/pages/og/`
- Live "System Monitor": reads `/status.json`; snapshot fetched at build, re-read in the browser every minute

## On the box

- `deploy/site-status.sh` → `/usr/local/bin/site-status`, run every minute by `site-status.timer`, writes `/var/www/status/status.json`
- `deploy/nginx.conf` → `/etc/nginx/sites-available/ajmalroshan.dev` (www and ajuroshan.me 301 to the apex)
- Releases: `/var/www/ajuroshan.me/{releases,current}`; rollback is `ln -sfn releases/<old> current`

## Releases

Production changes only on a tag. `main` pushes and PRs just build (`ci.yml`).

```bash
npm run release:patch   # content / fixes
npm run release:minor   # new sections
npm run release:major   # redesigns
```

The tag triggers `release.yml`: build (tag must match `package.json`), GitHub Release with the tarball, deploy that tarball over SSH, smoke-test that the version is live. The running version is in the taskbar tray.
