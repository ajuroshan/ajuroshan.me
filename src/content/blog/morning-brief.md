---
title: My server texts me my day at 7 am
description: A small Python script reads my calendar, mail, WhatsApp and habits, and sends one Telegram message. The third version is the first one I actually read.
date: 2026-11-06
tags: [python, telegram, llm, automation]
---

Every morning at 7 my phone buzzes with one Telegram message: what's on today, who I owe a reply, which emails actually need me, and whether I skipped the gym yesterday. A cron job on my server writes it. It took three tries to make it something I read instead of swipe away.

## Version one: everything

The first version dumped it all in. Every calendar event, every unread email, every WhatsApp group, GitHub activity, habits, a quote. It was technically complete and practically useless. I'd see a wall of text and close it.

## Version two: smarter, still too much

So I gave the facts to a model and asked it to pick the three things that matter today, and to sort email into "needs you" and "just so you know". Better. But on a phone the message was still long and crowded, and I still had to scroll to find the point.

## Version three: say less

The current one has a short top section and hides the rest:

- **Top 3**, picked by the model
- **Today**: only real calendar events, with times
- **Reply to**: WhatsApp chats waiting on me
- **Needs you**: the emails that need an action
- everything else (free time, groups, PRs, yesterday, tomorrow) folded into one collapsed block

Telegram's HTML mode has `<blockquote expandable>`, which shows two lines and expands on tap. That one tag did more for readability than any prompt change.

## The day it said nothing

The morning after I switched to a newer model, the brief arrived with headings and nothing under them. No error anywhere. The answer was just an empty string.

The usage numbers explained it: I had capped the reply at 900 tokens, and the new model reasons before answering, out of the same budget. It reasoned for all 900 and never got to the answer. The fix was two settings:

```python
"max_tokens": 6000,
"reasoning": {"effort": "low"},
```

Lesson learned: when you change models, read the token usage on the first reply, not just whether it returned 200.

## What it runs on

Python with no framework. The calendar and Gmail come through [gog](https://github.com/openclaw/gogcli), WhatsApp through a local sync of my own account, habits from my habit tracker's API, and the model through OpenRouter. It all lives on the same free ARM box as this site.
