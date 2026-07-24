---
title: 基于扩散策略的灵巧操作
role: 负责人 & 研究者
period: 2024 – 至今
summary: 用基于扩散的视觉运动策略，教一台 6 自由度机械臂完成接触密集的操作任务。
tags: ['robotics', 'embodied-ai', 'ml']
links:
  code: https://github.com/yourname/diffusion-manip
  demo: https://yourname.github.io/diffusion-manip
highlights:
  - 通过遥操作在 8 个任务上采集了 2000 条示范
  - 在腕部 + 侧视相机上训练扩散策略（DDIM，20 步）
  - 在未见物体上成功率 78%，比 BC 基线高 24%
cover: /photography/lab-01.jpg
order: 1
---

## 概述

我们训练了一个**基于扩散的视觉运动策略**，将多视角 RGB 图像映射为连续的机器人动作。
该策略以视觉观测为条件对动作轨迹去噪，从而实现稳定、接触密集的操作。

## 方法

- 使用 SpaceMouse 遥操作装置采集示范。
- 带 FiLM 条件化的 U-Net 去噪器，以图像编码器输出为条件。
- 在单张消费级 GPU 上以 10 Hz 推理。

## 结果

请查看 [demo](https://yourname.github.io/diffusion-manip) 中在留出物体上的实机回放。
