---
title: RoboECG — 机器人 ECG 电极自主定位与贴放
role: 科研项目（导师指导）
period: "2026"
summary: 机械臂用俯视深度相机感知仰卧患者胸廓，按临床规则定位六个 ECG 胸导联（V1–V6）、逐个按压贴放并自检——在 Isaac Sim + UR3 上完成全闭环。
tags: ['robotics', 'embodied-ai', 'cv']
links:
  code: https://github.com/Jxy-yxJ/RoboECG
  page: https://Jxy-yxJ.github.io/zh/roboecg/
highlights:
  - 一次成功率 6/6；接触误差 0.14–0.36 mm
  - 深度目标定位 360 次留出贴放均值 6.08 mm（95% CI 5.53–6.64）
  - 定位规则经两个独立公开电极数据集验证
cover: /roboecg/cover.png
order: 0
---

## 概述

ECG 电极贴放的执行环节在公开文献里是空白：现有工作要么检测已贴好的电极，要么预测应该贴在哪。
RoboECG 补齐了"定位 → 到达 → 按压 → 自检 → 重贴"全闭环，并用独立公开的电极数据验证定位规则。

详见[项目主页](https://Jxy-yxJ.github.io/zh/roboecg/)与[代码仓库](https://github.com/Jxy-yxJ/RoboECG)。
