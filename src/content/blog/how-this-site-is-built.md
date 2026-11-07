---
title: How this site is built and shipped
description: A Windows 98 desktop in my browser, one free ARM server, and deploys that are basically renaming a folder.
date: 2026-11-07
tags: [astro, nginx, oci, deploys]
---

I wanted my site to feel like the family computer I grew up on. Teal wallpaper, chunky grey buttons, a Start menu that does slightly too much. So that's what this is.

## The build

[Astro](https://astro.build) turns everything into plain HTML ahead of time. [98.css](https://jdan.github.io/98.css/) does the heavy lifting on the bevels and title bars, and I'm very grateful to whoever had the patience to get those shadows right.

The icons I drew myself, pixel by pixel, as little text maps in the code. A 16×16 floppy disk is 256 decisions and I have opinions about every one of them.

There's a bit of JavaScript to drag windows around and run the Start menu. Turn it off and every page still works, it just stops pretending to be a computer. No analytics, no cookies, nobody watching.

## The server

It all runs on one Oracle Cloud *Always Free* ARM box in Hyderabad. Free, as in I pay nothing, which still feels like a bug they'll fix someday.

Nothing on it is open to the internet. A Cloudflare Tunnel dials out, and Cloudflare hands the requests to nginx. The System Monitor window reads a tiny JSON file the box rewrites every minute, so if you see "Running" there, it really is.

## Deploys

Nothing changes on the live site until I push a version tag. GitHub Actions builds it and copies the build over:

```bash
rsync -az --delete --link-dest="$ROOT/current/" dist/ "oci:$ROOT/releases/$REL/"
ssh oci "ln -sfn $ROOT/releases/$REL $ROOT/current.tmp && mv -Tf $ROOT/current.tmp $ROOT/current"
```

The whole trick is that last line. Swapping a symlink is one rename, so you never catch the site half-uploaded. If I break something, rolling back is pointing the link at yesterday's folder. I have done this more than once.

## Why not Vercel?

Honestly, Vercel would be easier. But the box was already sitting there doing my chores, and I like knowing exactly where every byte comes from. Also it's more fun this way.
