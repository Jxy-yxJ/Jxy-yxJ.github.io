import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// 共享材质（高级工业感：珍珠白 + 石墨金属关节 + 赭石呼吸灯）
const white = new THREE.MeshStandardMaterial({ color: 0xf4f1ea, roughness: 0.32, metalness: 0.15 });
const joint = new THREE.MeshStandardMaterial({ color: 0x2b2b30, roughness: 0.3, metalness: 0.85 });
const visor = new THREE.MeshStandardMaterial({ color: 0x111114, roughness: 0.12, metalness: 0.4 });
const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.9, roughness: 0.4 });

export interface HumanoidParts {
  body: THREE.Group;
  head: THREE.Group;
  eyeL: THREE.Mesh;
  eyeR: THREE.Mesh;
  chest: THREE.Mesh;
  shoulderR: THREE.Group;
  baseY: number;
}

export function buildHumanoid(): { group: THREE.Group; parts: HumanoidParts } {
  const group = new THREE.Group();
  const body = new THREE.Group();
  group.add(body);

  // ---------- 腿 ----------
  for (const side of [-1, 1]) {
    const leg = new THREE.Group();
    const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.26, 6, 12), joint);
    thigh.position.y = -0.26;
    const shin = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.26, 6, 12), joint);
    shin.position.y = -0.58;
    const foot = new THREE.Mesh(new RoundedBoxGeometry(0.17, 0.09, 0.27, 4, 0.03), white);
    foot.position.set(0, -0.82, 0.05);
    leg.add(thigh, shin, foot);
    leg.position.set(side * 0.16, 0.86, 0);
    body.add(leg);
  }

  // ---------- 躯干 ----------
  const torso = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.72, 0.4, 6, 0.12), white);
  torso.position.y = 1.42;
  body.add(torso);

  // 胸口呼吸灯（独立材质便于动画）
  const chestMat = new THREE.MeshStandardMaterial({
    color: 0xc2683a, emissive: 0xc2683a, emissiveIntensity: 1.0, roughness: 0.45, metalness: 0.2,
  });
  const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.03, 24), chestMat);
  chest.rotation.x = Math.PI / 2;
  chest.position.set(0, 1.5, 0.21);
  body.add(chest);

  // ---------- 手臂 ----------
  function makeArm(side: number) {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.38, 1.74, 0);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), joint);
    const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.22, 6, 12), white);
    upper.position.y = -0.18;
    const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), joint);
    elbow.position.y = -0.34;
    const fore = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.2, 6, 12), white);
    fore.position.y = -0.48;
    const hand = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.12, 0.06, 4, 0.02), joint);
    hand.position.y = -0.64;
    shoulder.add(ball, upper, elbow, fore, hand);
    body.add(shoulder);
    return shoulder;
  }
  makeArm(-1);
  const shoulderR = makeArm(1);

  // ---------- 颈 + 头 ----------
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.1, 16), joint);
  neck.position.y = 1.86;
  body.add(neck);

  const head = new THREE.Group();
  head.position.y = 2.0;
  const skull = new THREE.Mesh(new RoundedBoxGeometry(0.4, 0.34, 0.36, 6, 0.1), white);
  head.add(skull);
  const visorMesh = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.16, 0.06, 4, 0.03), visor);
  visorMesh.position.set(0, 0.02, 0.17);
  head.add(visorMesh);
  const eyeGeo = new THREE.CapsuleGeometry(0.018, 0.05, 4, 8);
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-0.08, 0.02, 0.2);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeR.position.set(0.08, 0.02, 0.2);
  head.add(eyeL, eyeR);
  // 天线
  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.12, 8), joint);
  antenna.position.set(0.13, 0.22, 0);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.02, 10, 10),
    new THREE.MeshStandardMaterial({ color: 0xc2683a, emissive: 0xc2683a, emissiveIntensity: 0.8 }));
  tip.position.set(0.13, 0.3, 0);
  head.add(antenna, tip);
  body.add(head);

  return { group, parts: { body, head, eyeL, eyeR, chest, shoulderR, baseY: 0 } };
}
