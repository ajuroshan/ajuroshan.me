---
title: How this site is built and shipped
description: A Windows 98 desktop made of plain HTML, one free ARM server in Hyderabad, and deploys that are a folder swap.
date: 2026-11-07
tags: [astro, nginx, oci, deploys]
---

I wanted my site to feel like the computer I grew up with: teal wallpaper, grey buttons, a Start menu. So it's a desktop.

## The build

[Astro](https://astro.build) renders every page to plain HTML ahead of time. [98.css](https://jdan.github.io/98.css/) draws the bevels and title bars. The icons are 16×16 pixel maps written as text in the code and turned into SVG at build time.

Every page is a real page, so search engines and people without JavaScript get normal HTML. With JavaScript, clicking a link fetches that page and pulls its window onto your desktop instead of navigating. The URL still changes, so links and the back button work. On phones it just uses normal pages, because dragging windows with your thumb is nobody's idea of fun.

No analytics, no cookies.

## The server

It's one Oracle Cloud *Always Free* ARM machine: 2 cores and 12 GB of memory, in Hyderabad. It also runs my assistant, my habit tracker and the [morning brief](/blog/morning-brief/), and it mostly sits at a load of 0.1.

Nothing on it is open to the internet. A Cloudflare Tunnel connects out, and Cloudflare hands requests to nginx. The System Monitor window reads a small JSON file that a systemd timer rewrites every minute.

## Deploys

A release is a folder on the server. Deploying copies the new build into a new folder and points a symlink at it:

```bash
rsync -az --delete --link-dest="$ROOT/current/" dist/ "oci:$ROOT/releases/$REL/"
ssh oci "ln -sfn $ROOT/releases/$REL $ROOT/current.tmp && mv -Tf $ROOT/current.tmp $ROOT/current"
```

Swapping a symlink with `mv -T` is a single rename, so nobody ever sees a half-uploaded site. Rolling back means pointing the link at the previous folder. The last five stay around for that.

## Why not Vercel?

Vercel would be easier. But the box was already on and doing my chores, and I like knowing where every byte comes from.
