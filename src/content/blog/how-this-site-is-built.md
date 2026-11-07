---
title: How this site is built and shipped
description: A Windows 98 desktop made of plain HTML, a little JavaScript window manager, and deploys that are a folder swap.
date: 2026-11-07
tags: [astro, javascript, deploys]
---

I wanted my site to feel like the computer I grew up with: teal wallpaper, grey buttons, a Start menu. So it's a desktop.

## The build

[Astro](https://astro.build) renders every page to plain HTML ahead of time. [98.css](https://jdan.github.io/98.css/) draws the bevels and title bars. The icons are 16×16 pixel maps written as text in the code and turned into SVG at build time.

## The windows

Every page is a real page, so search engines and people without JavaScript get normal HTML. With JavaScript, clicking a link fetches that page and pulls its window onto your desktop instead of navigating. The URL still changes, so links and the back button work. On phones it just uses normal pages, because dragging windows with your thumb is nobody's idea of fun.

Minesweeper and the MS-DOS Prompt are custom elements, so they keep working no matter which page their window was pulled from. No analytics, no cookies.

## Deploys

A release is a folder. Deploying copies the new build into a fresh folder and points a symlink at it:

```bash
rsync -az --delete --link-dest="$ROOT/current/" dist/ "$HOST:$ROOT/releases/$REL/"
ssh "$HOST" "ln -sfn $ROOT/releases/$REL $ROOT/current.tmp && mv -Tf $ROOT/current.tmp $ROOT/current"
```

Swapping a symlink with `mv -T` is a single rename, so nobody ever sees a half-uploaded site. Rolling back means pointing the link at the previous folder.

## Why not Vercel?

Vercel would be easier. But I like knowing where every byte comes from, and it's more fun this way.
