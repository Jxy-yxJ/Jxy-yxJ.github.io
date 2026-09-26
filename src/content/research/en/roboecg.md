---
title: RoboECG — autonomous robotic ECG electrode placement
role: Research project (advisor-supervised)
period: "2026"
summary: A robot arm that perceives a supine patient's chest from an overhead depth camera, localises the six precordial ECG electrodes (V1–V6) from clinical rules, presses them onto the skin and verifies its own work — in Isaac Sim with a UR3.
tags: ['robotics', 'embodied-ai', 'cv']
links:
  code: https://github.com/Jxy-yxJ/RoboECG
  page: https://Jxy-yxJ.github.io/en/roboecg/
highlights:
  - 6/6 first-attempt success; contact error 0.14–0.36 mm
  - Target localisation 6.08 mm mean over 360 held-out placements (95% CI 5.53–6.64)
  - Rules validated against two independent public electrode datasets
cover: /roboecg/cover.png
order: 0
---

## Overview

The execution side of ECG electrode placement is a gap in the published literature: existing work
either detects electrodes that have already been placed, or predicts where they should go. RoboECG
implements the full loop — localisation → reach → press → self-check → re-place — and validates the
localisation rules against independently published electrode data.

See the [project page](https://Jxy-yxJ.github.io/en/roboecg/) and the
[code](https://github.com/Jxy-yxJ/RoboECG).
