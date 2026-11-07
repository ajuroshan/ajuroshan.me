---
title: Engine buzz on a handlebar phone
description: My bike dashboard said I was pulling 3 g under braking. I was not. Here's how engine vibration lies to a phone, and the tiny filter that fixed it.
date: 2026-08-20
tags: [motorcycle, sensors, android, apex]
---

[APEX](https://github.com/ajuroshan/apexdash) is the dashboard app I run on a phone clipped to my handlebars. It shows speed, how far I'm leaning, and g-force, and it remembers the biggest numbers from each ride.

After the first real ride it told me I'd hit 3 g under braking. For reference, that's about what a fighter pilot complains about. I had barely touched the brake.

## What was going on

The phone mount is solid, which is good for reading the screen and bad for everything else. Every bit of engine buzz goes straight into the phone's motion sensor.

Real riding forces are slow. Braking or leaning into a corner builds up over a few tenths of a second. Engine buzz is fast, way faster than the sensor can sample properly, so it sneaks in as random spikes. Most readings are fine. Then one spike gets through, and since the app keeps the peak value, that one spike becomes my "best" braking for the whole ride.

## The fix

A really simple low-pass filter on each axis:

```kotlin
y += alpha * (x - y)   // alpha = dt / (tau + dt)
```

It smooths out anything fast and lets the slow stuff through. Braking and cornering come through almost untouched, and the buzz disappears. How much it smooths is a setting, because a big twin and a single-cylinder bike buzz very differently.

## The bonus

The bit the filter throws away, `x - y`, turned out to be useful too. That's the vibration the phone is actually feeling. APEX now shows it as VIBRATION on the telemetry screen, and it jumps when a mount bolt starts working loose. I check it every time I fiddle with the handlebars.
