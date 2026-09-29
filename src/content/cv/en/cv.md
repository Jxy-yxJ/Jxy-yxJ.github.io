---
name: Xinyu Jiang
title: Robotics & Embodied AI
updated: 2026-09-29
pdf: /cv/cv-en.pdf
---

Hangzhou Dianzi University · Intelligent Science and Technology · Hangzhou, China
[23061740@hdu.edu.cn](mailto:23061740@hdu.edu.cn) · [jiaoxiangyue3@gmail.com](mailto:jiaoxiangyue3@gmail.com)
[GitHub](https://github.com/Jxy-yxJ) · [LinkedIn](https://www.linkedin.com/in/xinyu-jiang-a00b17402) · [Website](https://Jxy-yxJ.github.io/en/)

## Education

**B.S. in Intelligent Science and Technology** — Hangzhou Dianzi University (2023 – 2027)
Focus: robotics, computer vision, machine learning, optimization.

## Research Projects

**RoboECG — autonomous robotic ECG electrode placement** (2026)
- A UR3 perceives a supine patient's chest from an overhead depth camera, locates the six precordial electrodes (V1–V6) from clinical rules, presses them onto the skin, and self-checks — in Isaac Sim.
- 6/6 first-attempt placements with 0.14–0.36 mm contact error; depth-based localization 6.08 mm mean over 360 held-out placements (95% CI 5.53–6.64).
- Validated the localization rules against 25 statistical-shape torsos and 120 measured electrodes (PhysioNet/CinC 2007).
- Code: github.com/Jxy-yxJ/RoboECG

**Robotic Thyroid Scanning in Isaac Sim** (2026)
- Reproduced the coarse-localization stage of an autonomous thyroid-ultrasound system: RGB-D perception (MediaPipe), depth-fused target localization, and collision-aware UR3 planning.
- 0.70 mm reach error with ≥ 2.26 cm guaranteed body clearance; depth fusion improves localization 25% (6.23 → 4.67 cm) across 7 perturbations; 40 simulator-free unit tests + CI.
- Code: github.com/Jxy-yxJ/robotic-thyroid-scanning-isaac-sim

**MemoryGuard — bounded active memory maintenance** (2026)
- Long-horizon embodied agents act on stale remembered locations; MemoryGuard decides when to verify, verifies with a grounded signal, refreshes on staleness, then acts, all under a bounded revisit budget.
- Built on AI2-THOR with a Grounded-SAM2 detector and a vision-language model; found that a strong VLM detects staleness 6/6 but updates correctly only 3/6.
- Code: github.com/Jxy-yxJ/MemoryGuard

## Skills

- **Programming:** Python, Git / GitHub Actions, Linux
- **Robotics simulation:** NVIDIA Isaac Sim, AI2-THOR, UR3 + Lula IK
- **Perception & ML:** RGB-D geometry, MediaPipe, OpenCV, PyTorch, Transformers, NumPy
- **Web:** Astro, TypeScript

## Activities

- Photographer; drummer in the indie band 巧克力文件岛.
