---
title: The model answered with nothing
description: A morning-brief script that worked for weeks started returning empty replies. The reasoning tokens had eaten the whole output budget.
date: 2026-11-06
tags: [llm, openrouter, python, debugging]
---

Every morning at seven a script on my server gathers the day (calendar, unread mail, the WhatsApp threads that need a reply, the habits I missed) and asks a model to pick the three things that matter. The result goes to Telegram as one message. It had worked for weeks. Then one morning the message arrived with the headings and no content.

## What the log said

The HTTP call succeeded. The JSON parsed. The `content` field was an empty string. The only hint was in the usage block:

```json
"usage": { "prompt_tokens": 2140, "completion_tokens": 900, "completion_tokens_details": { "reasoning_tokens": 900 } }
```

The request set `max_tokens: 900`. The model I had switched to a few days earlier reasons before it answers, and its reasoning counts against the same budget as the answer. It thought for nine hundred tokens, hit the ceiling, and returned the answer it had not started yet.

## The fix

Two changes. First, give it room:

```python
"max_tokens": 6000,
```

Second, tell it how much to think. OpenRouter passes a `reasoning` object through to the models that support it:

```python
"reasoning": {"effort": "low"},
```

With low effort the model spends a hundred or two tokens reasoning and the rest on the answer. The brief itself is short, so the total cost barely moved, and it has not come back empty since.

## The lesson

When you change models, re-read the usage block on the first call. A reasoning model is a different contract: the output budget is shared, and a response can be well-formed and empty at the same time. I now log `reasoning_tokens` next to `completion_tokens` on every call, and the script retries once with a bigger budget if the content comes back blank.
