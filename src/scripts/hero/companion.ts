import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { HeroMaterials } from './materials';

export interface Companion {
  group: THREE.Group;
  parts: { body: THREE.Group; head: THREE.Group; pupilL: THREE.Mesh; pupilR: THREE.Mesh };
  triggerReact(now: number): void;
  update(dt: number, t: number): void;
  dispose(): void;
}

function lerp(a: number, b: number, k: number) { return a + (b - a) * k; }

export function buildCompanion(M: HeroMaterials): Companion {
  const group = new THREE.Group();
  const body = new THREE.Group();
  group.add(body);

  // 悬浮底座（暗环 + 发光盘）
  const hoverRing = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.02, 12, 40), M.joint);
  hoverRing.rotation.x = Math.PI / 2;
  hoverRing.position.y = 0.02;
  body.add(hoverRing);
  const hoverGlow = new THREE.Mesh(
    new THREE.CircleGeometry(0.16, 32),
    new THREE.MeshBasicMaterial({ color: 0xd9824f, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  hoverGlow.rotation.x = -Math.PI / 2;
  hoverGlow.position.y = -0.005;
  body.add(hoverGlow);

  // 身体
  const torso = new THREE.Mesh(new RoundedBoxGeometry(0.4, 0.36, 0.34, 6, 0.12), M.shell);
  torso.position.y = 0.32; torso.castShadow = true; torso.receiveShadow = true;
  body.add(torso);
  const waist = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.06, 0.36, 4, 0.025), M.accent);
  waist.position.y = 0.24; body.add(waist);

  // 机械小手
  for (const side of [-1, 1]) {
    const arm = new THREE.Group();
    arm.position.set(side * 0.23, 0.4, 0.02);
    const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.028, 0.1, 6, 12), M.shellWarm);
    upper.rotation.z = side * 0.9;
    upper.position.set(side * 0.045, -0.03, 0);
    const claw = new THREE.Mesh(new RoundedBoxGeometry(0.05, 0.04, 0.04, 3, 0.015), M.joint);
    claw.position.set(side * 0.1, -0.09, 0.01);
    arm.add(upper, claw);
    body.add(arm);
  }

  // 头：半透明玻璃面罩 + 发光双眼
  const head = new THREE.Group();
  head.position.y = 0.6;
  const skull = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.28, 0.3, 6, 0.1), M.shell);
  skull.castShadow = true;
  head.add(skull);
  const visor = new THREE.Mesh(new RoundedBoxGeometry(0.27, 0.15, 0.06, 4, 0.05), M.glass);
  visor.position.set(0, 0.0, 0.145);
  head.add(visor);

  const pupilMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xbfe3ff, emissiveIntensity: 1.5, roughness: 0.3 });
  const pupilGeo = new THREE.CapsuleGeometry(0.014, 0.05, 4, 8);
  const pupilL = new THREE.Mesh(pupilGeo, pupilMat);
  pupilL.position.set(-0.055, 0.0, 0.175);
  const pupilR = new THREE.Mesh(pupilGeo, pupilMat.clone());
  pupilR.position.set(0.055, 0.0, 0.175);
  head.add(pupilL, pupilR);

  // 顶部小天线
  const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.1, 8), M.metal);
  ant.position.set(0.08, 0.2, 0);
  const antTip = new THREE.Mesh(new THREE.SphereGeometry(0.014, 10, 10), M.accentGlow);
  antTip.position.set(0.08, 0.26, 0);
  head.add(ant, antTip);
  body.add(head);

  // 状态
  let reactT = -99;
  let blinkT = -99;
  let nextBlink = 1.5 + Math.random() * 3;

  function triggerReact(now: number) { reactT = now; }

  function update(_dt: number, t: number) {
    // 悬浮呼吸
    body.position.y = 0.12 + Math.sin(t * 1.6) * 0.03;
    body.rotation.z = Math.sin(t * 1.1) * 0.04;

    // 眨眼
    if (t > nextBlink) { blinkT = t; nextBlink = t + 2 + Math.random() * 3; }
    const ph = (t - blinkT) / 0.14;
    const bs = ph >= 0 && ph < 1 ? 1 - Math.sin(ph * Math.PI) * 0.9 : 1;
    pupilL.scale.y = bs; pupilR.scale.y = bs;

    // 点击反应：弹跳 + 自转 + 笑眼
    const rp = (t - reactT) / 0.9;
    if (rp >= 0 && rp < 1) {
      body.position.y += Math.sin(rp * Math.PI) * 0.4;
      body.rotation.y = rp * Math.PI * 2;
      pupilL.scale.y = 0.4; pupilR.scale.y = 0.4;
    } else {
      body.rotation.y = lerp(body.rotation.y, 0, 0.12);
    }
  }

  function dispose() {
    group.traverse((o: any) => { if (o.geometry) o.geometry.dispose(); });
  }

  return { group, parts: { body, head, pupilL, pupilR }, triggerReact, update, dispose };
}
