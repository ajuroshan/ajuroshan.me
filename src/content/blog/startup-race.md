---
title: The crash loop was a race
description: My assistant's memory service kept crash-looping after every reboot. Nothing was broken. Two services were just starting in the wrong order.
date: 2026-11-06
tags: [linux, systemd, debugging]
---

My server runs an assistant I talk to on Telegram. It has a memory service, a small database that only one process is allowed to write to at a time. After a reboot the memory part kept crash-looping, and the assistant forgot everything I asked it.

## What was happening

Two services want that database: the gateway that talks to Telegram, and a web dashboard. Only one of them can hold the write lock. After a reboot systemd started them both at once, and the dashboard usually won. The gateway then failed to get the lock, crashed, restarted, failed again, forever.

Nothing was actually broken. Start the gateway by hand first and everything worked. It was purely about who got there first.

## The fix

A systemd drop-in that makes the dashboard wait for the gateway:

```ini
# /etc/systemd/system/hermes-dashboard.service.d/10-after-gateway.conf
[Unit]
After=hermes-gateway.service
Wants=hermes-gateway.service

[Service]
ExecStartPre=/bin/sleep 45
```

`After=` only orders the *start* of the units, not "the gateway has finished setting up", so the 45-second sleep gives it time to actually take the lock. It's not elegant, but it has survived every reboot since.

## The habit I'm keeping

When something crash-loops only after a reboot, check what else starts at the same moment before reading any code. `systemctl list-dependencies` and the timestamps in `journalctl -b` would have shown me the race in two minutes instead of the hour I spent staring at stack traces.
