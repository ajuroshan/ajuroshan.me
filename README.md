# ajmalroshan.dev

Personal site of Ajmal Roshan: a late-90s desktop in the browser, built with Astro.

```bash
npm i
npm run dev        # http://localhost:4321
npm run build && npm run preview
```

## Where things are

- Words about me and projects: `src/data/profile.ts`
- Notes: `src/content/blog/*.md` (frontmatter: `title`, `description`, `date`, optional `updated`, `tags`, `draft`)
- Windows, taskbar, Start menu, window manager: `src/components/Window.astro`, `src/layouts/Base.astro`
- Pixel icons (16×16 maps in text, emitted as SVG): `src/components/Icon.astro`
- Apps: `src/scripts/minesweeper.ts`, `src/scripts/dos.ts`, `src/scripts/pipes.ts` (screensaver)
- Widgets: `src/styles/98.css` (98.css v0.1.21 by Jordan Scales, MIT, one media query patched for lightningcss)
- SEO: `src/components/Seo.astro`, sitemap, RSS at `/rss.xml`, OG images rendered at build in `src/pages/og/`

## Releases

Production changes only on a tag. `main` pushes and PRs just build (`ci.yml`).

```bash
npm run release:patch   # content / fixes
npm run release:minor   # new things
```

The tag triggers `release.yml`: build (tag must match `package.json`), GitHub Release with the tarball, then the server pulls the latest release itself (no inbound SSH; it verifies the asset's sha256) and the `live` job waits until it's serving.
