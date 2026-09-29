---
title: How this site is built and shipped
description: Astro, zero client-side JavaScript, nginx on an always-free Oracle Cloud VM, and tag-driven releases.
date: 2026-09-29
tags: [astro, nginx, oci, devops]
---

This site is deliberately boring infrastructure: static HTML, one small VM, one shell script.

## Stack

- **[Astro](https://astro.build)**: renders every page to plain HTML at build time. The site ships no client-side JavaScript at all; the figure on the home page is plain inline SVG.
- **Markdown content collections**: every post is a `.md` file with a typed frontmatter schema, so a missing date fails the build rather than the page.
- **Libertinus Serif** and **IBM Plex Mono**, self-hosted. No third-party requests.
- **nginx** on an Oracle Cloud *Always Free* `VM.Standard.E2.1.Micro` with 1 GB of RAM.

## Deploys

Production only changes when I push a `vX.Y.Z` tag. GitHub Actions builds the site, attaches the build to a GitHub Release, and ships that exact tarball.

A build is a directory of files, so a deploy is a copy plus a symlink swap:

```bash
npm run build
rsync -az --delete --link-dest="$ROOT/current/" dist/ "oci:$ROOT/releases/$REL/"
ssh oci "ln -sfn $ROOT/releases/$REL $ROOT/current.tmp && mv -Tf $ROOT/current.tmp $ROOT/current"
```

`mv -T` over a symlink is a single `rename(2)`, so nginx never serves a half-copied tree. `--link-dest` hard-links unchanged files from the previous release, which makes keeping the last five releases for rollback almost free.

## Caching

Astro fingerprints everything under `/_astro/`, so those files get `Cache-Control: immutable` for a year. HTML gets five minutes. That's the entire caching strategy.

## Why not a platform?

Vercel or Cloudflare Pages would work well here. But I already run a box for my other services, and I like knowing where every byte comes from.
