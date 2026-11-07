---
title: Engine buzz on a handlebar phone
description: A bar-mounted phone turns engine vibration into fake g-force peaks. A one-pole low pass fixes it, and the rejected energy turns out to be a useful number.
date: 2026-08-20
tags: [motorcycle, sensors, android, apex]
---

[APEX](https://github.com/ajuroshan/apexdash) is a monochrome dashboard for a phone on a motorcycle's handlebars: speed, lean angle and g-force on one black screen. The g-force readout keeps the peak values of a ride, and in the first version the peaks were nonsense. Three g of braking on a road where I had barely touched the lever.

## Where it comes from

A bar mount is rigid, which is what you want for the screen, and it passes engine and road buzz straight into the phone's accelerometer. That energy sits far above the frequency of anything a rider actually does; braking and cornering build over a few tenths of a second. But the sensor samples at about 50 Hz, so the buzz aliases down into the band where real riding forces live. Most samples are fine. One is a spike. The peak figures are latched maxima, so one spike ruins the peak g for the whole ride.

## The filter

A one-pole low pass on each axis:

```kotlin
y += alpha * (x - y)   // alpha = dt / (tau + dt)
```

With a time constant of a few hundred milliseconds, braking and cornering pass through almost untouched and the buzz is gone. `tau` is a setting, because a big twin and a thumper do not buzz alike, and neither do two mounts.

## Keep what you throw away

The rejected part of the signal, `x - y`, is not noise to discard. Its RMS is the vibration the phone is actually seeing, in g. APEX shows it as VIBRATION on the telemetry panel. It tells you how rough the mount is, and it changes noticeably when a bolt works loose. That number came free with the filter, and it is the one I look at first after changing anything on the bars.
