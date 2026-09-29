---
title: MemoryGuard — bounded active memory maintenance
role: Research project
period: "2026"
summary: Long-horizon embodied agents act on remembered object locations that silently go stale. MemoryGuard decides whether to verify, verifies with a grounded perception signal, refreshes on staleness, then acts — all under a bounded revisit budget.
tags: ['embodied-ai', 'ml']
links:
  code: https://github.com/Jxy-yxJ/MemoryGuard
  page: https://jxy-yxj.github.io/MemoryGuard/
highlights:
  - Detector-agnostic verify → update → act loop under a bounded revisit budget
  - 'Key finding: a strong vision-language model detects staleness 6/6 but makes the correct update only 3/6 — detection is not maintenance'
cover: /projects/memoryguard.webp
order: 2
---

## Overview

Built on AI2-THOR with a Grounded-SAM2 detector and a vision-language model as
the staleness signal. The mechanism trades a bounded number of revisits for
fresher memory, and shows that reliable detection does not imply reliable
maintenance.

See the [code](https://github.com/Jxy-yxJ/MemoryGuard) and
[project page](https://jxy-yxj.github.io/MemoryGuard/).
