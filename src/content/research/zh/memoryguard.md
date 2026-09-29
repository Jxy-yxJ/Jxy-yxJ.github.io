---
title: MemoryGuard — 有界主动记忆维护
role: 科研项目
period: "2026"
summary: 长程具身智能体依赖记忆中的物体位置行动，而这些记忆会悄悄过期。MemoryGuard 在行动前决定是否核验、用有据可依的感知信号核验、在过期时刷新记忆，再执行下游任务——整个过程受有界的重访预算约束。
tags: ['embodied-ai', 'ml']
links:
  code: https://github.com/Jxy-yxJ/MemoryGuard
  page: https://jxy-yxj.github.io/MemoryGuard/
highlights:
  - 与检测器无关的「核验 → 更新 → 行动」闭环，重访预算有界
  - '关键发现：强视觉语言模型能 6/6 检测出过期，但只有 3/6 做出正确的更新决策——检测不等于维护'
cover: /projects/memoryguard.webp
order: 2
---

## 概述

基于 AI2-THOR，用 Grounded-SAM2 检测器与视觉语言模型作为过期信号。该机制用有界的
重访次数换取更新的记忆，并说明「可靠地检测到过期」并不等于「可靠地维护记忆」。

代码见 [GitHub](https://github.com/Jxy-yxJ/MemoryGuard)，项目页见
[MemoryGuard](https://jxy-yxj.github.io/MemoryGuard/)。
