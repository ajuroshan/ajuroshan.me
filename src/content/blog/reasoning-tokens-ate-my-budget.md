---
title: The model answered with nothing
description: My morning brief showed up empty one day. Turns out the AI spent its whole word budget thinking and had nothing left to say.
date: 2026-11-06
tags: [llm, openrouter, python, debugging]
---

Every morning at 7 a little script on my server reads my calendar, my mail and my habits, asks an AI what actually matters today, and texts me the answer on Telegram. It's the first thing I read when I wake up. It had worked for weeks.

Then one morning it sent me the headings and nothing under them. Just a very confident, very empty message.

## What the log said

Nothing had crashed. The request went through, the reply parsed fine, and the answer was an empty string. The only clue was in the usage numbers:

```json
"usage": { "completion_tokens": 900, "completion_tokens_details": { "reasoning_tokens": 900 } }
```

I'd capped the reply at 900 tokens. A few days earlier I had switched to a newer model, one that thinks before it answers, and that thinking comes out of the same 900. It thought for all 900 tokens, ran out, and handed me what it had written so far, which was nothing.

Honestly? Relatable.

## The fix

Two lines. Give it more room:

```python
"max_tokens": 6000,
```

And tell it not to overthink:

```python
"reasoning": {"effort": "low"},
```

Now it thinks for a couple of hundred tokens and spends the rest actually telling me about my day. The cost barely moved, and the brief hasn't been empty since.

## What I took away

If you swap models, look at the token usage on the first reply, not just whether it worked. A thinking model plays by different rules: the reply can be perfectly valid and still say nothing. The script now logs the thinking tokens too, and retries once with more room if it ever comes back blank.
