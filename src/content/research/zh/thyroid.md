---
title: 基于 Isaac Sim 的机器人甲状腺超声扫描复现
role: 独立科研项目
period: "2026"
summary: 复现自主甲状腺超声机器人系统的粗定位阶段——RGB-D 感知（MediaPipe）、深度融合的甲状腺目标定位，以及论文相机几何下带碰撞约束的 UR3 运动规划。
tags: ['robotics', 'embodied-ai', 'cv']
links:
  code: https://github.com/Jxy-yxJ/robotic-thyroid-scanning-isaac-sim
  demo: https://github.com/Jxy-yxJ/robotic-thyroid-scanning-isaac-sim/blob/main/media/m4_reach.mp4
highlights:
  - 到达误差 0.70 mm，执行期人体最小间隙 ≥ 2.26 cm
  - 7 个相机/位姿扰动下，深度融合把目标定位误差降低 25%（6.23 → 4.67 cm）
  - 40 个不依赖仿真器的单元测试 + CI，并如实记录近似与失败案例
cover: /projects/thyroid.webp
order: 1
---

## 概述

在 Isaac Sim 中搭建四里程碑流水线：按论文相机几何渲染场景、估计人体关键点、
生成甲状腺目标、融合深度图、规划带碰撞约束的 UR3 到达。论文的粗定位使用颈/头
骨骼关节，本复现改用 RGB-D 感知，并加入带解剖约束的深度融合步骤。

## 结果

融合后仍有 4–6 cm 定位误差，超出超声扫描矩形——这正是论文引入 DQN 精细搜索阶段的
动机（本项目不实现）。

代码见 [GitHub](https://github.com/Jxy-yxJ/robotic-thyroid-scanning-isaac-sim)。
