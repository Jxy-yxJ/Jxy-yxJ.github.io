---
title: Dexterous Manipulation with Diffusion Policies
role: Lead Engineer & Researcher
period: 2024 – Present
summary: Teaching a 6-DoF robotic arm to perform contact-rich manipulation using diffusion-based visuomotor policies.
tags: ['robotics', 'embodied-ai', 'ml']
links:
  code: https://github.com/yourname/diffusion-manip
  demo: https://yourname.github.io/diffusion-manip
highlights:
  - Collected 2k demonstrations via teleoperation across 8 tasks
  - Trained a diffusion policy (DDIM, 20 steps) on wrist + side views
  - Achieved 78% success on unseen objects, +24% over BC baseline
cover: /photography/lab-01.jpg
order: 1
---

## Overview

We train a **diffusion-based visuomotor policy** that maps multi-view RGB images to
continuous robot actions. The policy denoises action trajectories conditioned on visual
observations, enabling stable, contact-rich manipulation.

## Methods

- Demonstrations collected with a SpaceMouse teleoperation rig.
- U-Net denoiser with FiLM conditioning on the image encoder.
- Inference at 10 Hz on a single consumer GPU.

## Results

See the [demo](https://yourname.github.io/diffusion-manip) for rollouts on held-out objects.
