---
title: How this site is built and shipped
description: Astro, a late-90s desktop in CSS, one free ARM server, and releases that are a symlink swap.
date: 2026-11-07
tags: [astro, nginx, oci, deploys]
---

This site is a folder of HTML files on a small server, and I would like to keep it that way.

## The build

[Astro](https://astro.build) renders every page ahead of time. [98.css](https://jdan.github.io/98.css/) draws the bevels, title bars and buttons. The icons are 16×16 pixel maps typed out as text and turned into SVG at build time.

A few kilobytes of JavaScript make the windows draggable and run the Start menu, the clock and the System Monitor. Without it every page still works. There are no analytics and no cookies.

## The server

One Oracle Cloud *Always Free* ARM machine runs this site and a few things of mine. Nothing on it is open to the internet. A Cloudflare Tunnel connects out, and Cloudflare passes requests to nginx.

The System Monitor reads a small JSON file that a timer on the box rewrites every minute.

## Deploys

Production changes only when I push a version tag. GitHub Actions builds the site and copies that exact build to the server:

```bash
rsync -az --delete --link-dest="$ROOT/current/" dist/ "oci:$ROOT/releases/$REL/"
ssh oci "ln -sfn $ROOT/releases/$REL $ROOT/current.tmp && mv -Tf $ROOT/current.tmp $ROOT/current"
```

Swapping a symlink with `mv -T` is a single rename, so nobody ever sees a half-copied site. Rolling back means pointing the link at an older folder.

## Why not a platform

Vercel or Cloudflare Pages would do this for free. But the box is already on, and I like knowing where every byte comes from.
