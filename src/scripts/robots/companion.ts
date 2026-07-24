import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// 「小方」——瓦力风的原创小机器人（奶白 + 赭石，非 WALL-E 形象）
const cream = new THREE.MeshStandardMaterial({ color: 0xf3ead9, roughness: 0.45, metalness: 0.1 });
const accent = new THREE.MeshStandardMaterial({ color: 0xc2683a, roughness: 0.4, metalness: 0.3 });
const dark = new THREE.MeshStandardMaterial({ color: 0x2b2b30, roughness: 0.35, metalness: 0.7 });
const glow = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.85, roughness: 0.4 });

export interface CompanionParts {
  body: THREE.Group;
  head: THREE.Group;
  pupilL: THREE.Mesh;
  pupilR: THREE.Mesh;
  stalkL: THREE.Group;
  stalkR: THREE.Group;
  baseY: number;
}

export function buildCompanion(): { group: THREE.Group; parts: CompanionParts } {
  const group = new THREE.Group();
  const body = new THREE.Group();
  group.add(body);

  // 身体（大圆角方盒）
  const torso = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.5, 0.42, 6, 0.14), cream);
  torso.position.y = 0.36;
  body.add(torso);
  // 赭石腰线
  const stripe = new THREE.Mesh(new RoundedBoxGeometry(0.52, 0.08, 0.44, 4, 0.03), accent);
  stripe.position.y = 0.42;
  body.add(stripe);

  // 头（穹顶头盖）
  const head = new THREE.Group();
  head.position.y = 0.64;
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    cream
  );
  cap.scale.set(1.25, 0.72, 1.05);
  head.add(cap);

  // 双眼杆 + 圆眼 pods（呆萌小螃蟹眼）
  function makeEye(side: number) {
    const stalk = new THREE.Group();
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.13, 8), dark);
    rod.position.y = 0.06;
    const pod = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), dark);
    pod.position.y = 0.15;
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.024, 12, 12), glow);
    pupil.position.set(0, 0.15, 0.045);
    stalk.add(rod, pod, pupil);
    stalk.position.set(side * 0.1, 0.04, 0.05);
    return { stalk, pupil };
  }
  const eyeL = makeEye(-1);
  const eyeR = makeEye(1);
  head.add(eyeL.stalk, eyeR.stalk);
  body.add(head);

  // 小圆脚（企鹅式重心）
  for (const side of [-1, 1]) {
    const foot = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), dark);
    foot.scale.set(1, 0.6, 1.2);
    foot.position.set(side * 0.14, 0.05, 0.03);
    body.add(foot);
  }

  return {
    group,
    parts: { body, head, pupilL: eyeL.pupil, pupilR: eyeR.pupil, stalkL: eyeL.stalk, stalkR: eyeR.stalk, baseY: 0 },
  };
}
