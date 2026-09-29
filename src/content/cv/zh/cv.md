---
name: 江鑫宇
title: 机器人 / 具身智能
updated: 2026-09-29
pdf: /cv/cv-zh.pdf
---

杭州电子科技大学 · 智能科学与技术 · 中国杭州
[23061740@hdu.edu.cn](mailto:23061740@hdu.edu.cn) · [jiaoxiangyue3@gmail.com](mailto:jiaoxiangyue3@gmail.com)
[GitHub](https://github.com/Jxy-yxJ) · [LinkedIn](https://www.linkedin.com/in/xinyu-jiang-a00b17402) · [个人主页](https://Jxy-yxJ.github.io/zh/)

## 教育背景

**智能科学与技术 学士** — 杭州电子科技大学（2023 – 2027）
方向：机器人学、计算机视觉、机器学习、最优化。

## 科研项目

**RoboECG — 机器人 ECG 电极自主定位与贴放**（2026）
- 机械臂用俯视深度相机感知仰卧患者胸廓，按临床规则定位六个 ECG 胸导联（V1–V6）、逐个按压贴放并自检——在 Isaac Sim + UR3 上完成全闭环。
- 一次成功率 6/6，接触误差 0.14–0.36 mm；深度目标定位在 360 次留出贴放上均值 6.08 mm（95% CI 5.53–6.64）。
- 定位规则经 25 例统计形状躯干与 120 个实测电极（PhysioNet/CinC 2007）验证。
- 代码：github.com/Jxy-yxJ/RoboECG

**基于 Isaac Sim 的机器人甲状腺超声扫描复现**（2026）
- 复现自主甲状腺超声机器人系统的粗定位阶段：RGB-D 感知（MediaPipe）、深度融合的目标定位、带碰撞约束的 UR3 规划。
- 到达误差 0.70 mm，执行期人体最小间隙 ≥ 2.26 cm；7 个扰动下深度融合把定位误差降低 25%（6.23 → 4.67 cm）；40 个纯逻辑单测 + CI。
- 代码：github.com/Jxy-yxJ/robotic-thyroid-scanning-isaac-sim

**MemoryGuard — 有界主动记忆维护**（2026）
- 长程具身智能体依赖会过期的记忆位置行动；MemoryGuard 在行动前决定是否核验、用有据可依的信号核验、过期时刷新，再执行，整个过程受有界重访预算约束。
- 基于 AI2-THOR，用 Grounded-SAM2 检测器与视觉语言模型；发现强视觉语言模型能 6/6 检测过期，但只有 3/6 做出正确更新。
- 代码：github.com/Jxy-yxJ/MemoryGuard

## 技能

- **编程：** Python、Git / GitHub Actions、Linux
- **机器人仿真：** NVIDIA Isaac Sim、AI2-THOR、UR3 + Lula IK
- **感知与机器学习：** RGB-D 几何、MediaPipe、OpenCV、PyTorch、Transformers、NumPy
- **Web：** Astro、TypeScript

## 其他

- 摄影；独立乐队「巧克力文件岛」鼓手。
