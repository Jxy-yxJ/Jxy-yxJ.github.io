---
title: Robotic Thyroid Scanning in Isaac Sim
role: Independent research project
period: "2026"
summary: Simulation reproduction of the coarse-localization stage of an autonomous thyroid-ultrasound system — RGB-D perception (MediaPipe), depth-fused thyroid target localization, and collision-aware UR3 motion planning at the paper's camera geometry.
tags: ['robotics', 'embodied-ai', 'cv']
links:
  code: https://github.com/Jxy-yxJ/robotic-thyroid-scanning-isaac-sim
  demo: https://github.com/Jxy-yxJ/robotic-thyroid-scanning-isaac-sim/blob/main/media/m4_reach.mp4
highlights:
  - 0.70 mm end-effector reach error with ≥ 2.26 cm guaranteed robot-to-body clearance
  - Depth fusion improves target localization 25% (6.23 → 4.67 cm) across 7 camera/pose perturbations
  - 40 simulator-free unit tests in CI, plus documented approximations and failure analysis
cover: /projects/thyroid.webp
order: 1
---

## Overview

A four-milestone pipeline in Isaac Sim: render the scene with the paper's camera
geometry, estimate body landmarks, form a thyroid target, fuse the depth image,
and plan a collision-aware UR3 reach. The paper's coarse localization uses
neck/head skeleton joints; this reproduction replaces them with RGB-D
perception and adds an anatomically constrained depth-fusion step.

## Result

The residual 4–6 cm localization error exceeds the ultrasound scan rectangle,
which is exactly the motivation for the paper's DQN fine-search stage (out of
scope here).

See the [code](https://github.com/Jxy-yxJ/robotic-thyroid-scanning-isaac-sim).
