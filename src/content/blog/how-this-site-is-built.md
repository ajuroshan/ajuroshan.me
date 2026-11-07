---
title: How this site is built and shipped
description: Astro, a late-90s desktop in CSS, nginx on an always-free ARM VM, a status file written every minute, and releases that are a symlink swap.
date: 2026-11-07
tags: [astro, nginx, oci, deploys]
---

This site is a directory of HTML files on a small ARM server, and I would like to keep it that way. Here is everything between a commit and your screen.

## The build

[Astro](https://astro.build) renders every page at build time. The desktop is CSS: [98.css](https://jdan.github.io/98.css/) draws the bevels, title bars and buttons, and the icons are 16×16 pixel maps written as text in the source and turned into SVG at build time. A few kilobytes of JavaScript make the windows draggable, minimisable and closable, run the Start menu and the clock, and re-read the server's status every minute. Without JavaScript every page is complete; the numbers are the ones the build saw.

Posts are Markdown files under `src/content/blog/` with a typed schema, so a missing date or an over-long title fails the build instead of shipping. Code is highlighted at build time, so no highlighter runs in the browser.

Fonts are the pixel MS Sans Serif that ships with 98.css, 6 KB each, plus Verdana and Georgia from your own machine. There is no icon font, no analytics script, no cookie.

Open Graph images are rendered at build time too: a hand-written SVG dialog box, rasterised by `resvg`, one per post.

## The server

An Oracle Cloud *Always Free* `VM.Standard.A1.Flex` with two ARM cores and twelve gigabytes of memory. It also runs my agent, my habit tracker and a WhatsApp mirror, and still idles at a load of 0.1.

Nothing on the machine listens to the internet. A [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) makes an outbound connection and Cloudflare hands requests to nginx on a private address. Anything I need to log in to sits behind Cloudflare Access, so the login page is Cloudflare's and the apps only see a signed header.

## The status file

The front page says what the box is doing. A systemd timer runs this every minute:

```bash
for u in nginx cloudflared hermes-gateway wacli-sync tailscaled fail2ban; do
  state=$(systemctl is-active "$u")
  since=$(systemctl show -p ActiveEnterTimestamp --value "$u")
  ...
done
```

It writes `/var/www/status/status.json` to a temporary file and renames it into place, nginx serves it with a thirty-second cache, and the page reads it. The build fetches the same file, so the HTML carries real numbers before any script runs.

## Deploys

Production changes only when I push a `vX.Y.Z` tag. GitHub Actions builds the site, attaches the build to a GitHub Release, and copies that exact tarball to the server:

```bash
rsync -az --delete --link-dest="$ROOT/current/" dist/ "oci:$ROOT/releases/$REL/"
ssh oci "ln -sfn $ROOT/releases/$REL $ROOT/current.tmp && mv -Tf $ROOT/current.tmp $ROOT/current"
```

`mv -T` over a symlink is one `rename(2)`, so nginx never serves a half-copied tree. `--link-dest` hard-links the files that did not change, which makes keeping the last five releases almost free. Rolling back is pointing the symlink at an older directory.

## Caching

Astro fingerprints everything under `/_astro/`, so those get `Cache-Control: immutable` for a year. HTML gets five minutes. Cloudflare sits in front and caches what nginx allows.

## Why not a platform

Vercel or Cloudflare Pages would do this well, and for free. But the box is already on, I already pay nothing for it, and I like knowing where every byte comes from and being the one who gets paged when it stops.
