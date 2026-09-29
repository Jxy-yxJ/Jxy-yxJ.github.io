import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { HeroMaterials } from './materials';

export interface ArmPose {
  joints: [number, number, number, number, number, number];
}

export interface Arm {
  group: THREE.Group;
  joints: THREE.Object3D[];
  probe: THREE.Group;
  reticle: THREE.Group;
  scanPlane: THREE.Mesh;
  keypoints: THREE.Group;
  /** 进入/退出“扫描”状态 */
  triggerScan(now: number): void;
  update(dt: number, t: number): void;
  dispose(): void;
}

// 关节点位姿（弧度）
const POSE_IDLE: ArmPose = { joints: [-0.5, 1.02, -1.62, 0.0, 1.15, 0.2] };
const POSE_REACH: ArmPose = { joints: [0.42, 0.72, -1.05, -0.1, 0.62, 0.0] };

function lerp(a: number, b: number, k: number) { return a + (b - a) * k; }

export function buildArm(M: HeroMaterials): Arm {
  const group = new THREE.Group();

  // ---------- 基座 ----------
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.46, 0.06, 48), M.metal);
  plinth.position.y = 0.03;
  plinth.receiveShadow = true;
  plinth.castShadow = true;
  group.add(plinth);

  const baseHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 0.2, 48), M.shell);
  baseHousing.position.y = 0.16;
  baseHousing.castShadow = true; baseHousing.receiveShadow = true;
  group.add(baseHousing);

  const baseRing = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.012, 12, 48), M.accent);
  baseRing.rotation.x = Math.PI / 2;
  baseRing.position.y = 0.27;
  group.add(baseRing);

  // 螺栓
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.02, 8), M.joint);
    bolt.position.set(Math.cos(a) * 0.4, 0.06, Math.sin(a) * 0.4);
    group.add(bolt);
  }

  // 静态线缆盘（基座附近）
  const cablePts: THREE.Vector3[] = [];
  for (let i = 0; i <= 40; i++) {
    const u = i / 40;
    const ang = u * Math.PI * 5;
    const r = 0.34 + u * 0.02;
    cablePts.push(new THREE.Vector3(Math.cos(ang) * r, 0.24 + u * 0.16, Math.sin(ang) * r));
  }
  const cable = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cablePts), 80, 0.02, 8, false),
    M.rubber
  );
  group.add(cable);

  // ---------- 关节链 ----------
  const j0 = new THREE.Group(); j0.position.y = 0.26; group.add(j0);          // 基座偏航 (Y)
  const j1 = new THREE.Group(); j1.position.y = 0.16; j0.add(j1);             // 肩 (Z)
  const j2 = new THREE.Group(); j2.position.y = 0.56; j1.add(j2);             // 肘 (Z)
  const j3 = new THREE.Group(); j3.position.y = 0.5; j2.add(j3);              // 腕1 (Y)
  const j4 = new THREE.Group(); j4.position.y = 0.12; j3.add(j4);            // 腕2 (Z)
  const j5 = new THREE.Group(); j5.position.y = 0.12; j4.add(j5);            // 腕3 (Y)

  const addJointHousing = (parent: THREE.Object3D, r: number, h: number, axis: 'x' | 'z') => {
    const hz = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 32), M.joint);
    if (axis === 'z') hz.rotation.x = Math.PI / 2;
    if (axis === 'x') hz.rotation.z = Math.PI / 2;
    hz.castShadow = true;
    parent.add(hz);
  };

  // j1 肩壳 + 上臂
  addJointHousing(j1, 0.11, 0.28, 'z');
  const upper = new THREE.Mesh(new RoundedBoxGeometry(0.13, 0.56, 0.15, 5, 0.05), M.shell);
  upper.position.y = 0.3;
  upper.castShadow = true; upper.receiveShadow = true;
  j1.add(upper);
  const upperStrip = new THREE.Mesh(new RoundedBoxGeometry(0.135, 0.12, 0.05, 3, 0.02), M.accent);
  upperStrip.position.set(0, 0.42, 0.085);
  j1.add(upperStrip);

  // j2 肘壳 + 前臂
  addJointHousing(j2, 0.095, 0.24, 'z');
  const fore = new THREE.Mesh(new RoundedBoxGeometry(0.115, 0.5, 0.13, 5, 0.045), M.shell);
  fore.position.y = 0.27;
  fore.castShadow = true; fore.receiveShadow = true;
  j2.add(fore);

  // j3 / j4 / j5 腕部（更细）
  addJointHousing(j3, 0.075, 0.18, 'x');
  const w1 = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.13, 24), M.shellWarm);
  w1.position.y = 0.07; w1.castShadow = true; j3.add(w1);
  addJointHousing(j4, 0.06, 0.15, 'z');
  const w2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.11, 24), M.shellWarm);
  w2.position.y = 0.06; w2.castShadow = true; j4.add(w2);
  addJointHousing(j5, 0.052, 0.13, 'x');

  // ---------- 法兰 + 末端（线阵超声探头） ----------
  const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.03, 32), M.metal);
  flange.position.y = 0.06; flange.castShadow = true; j5.add(flange);

  const probe = new THREE.Group();
  probe.position.y = 0.075;
  j5.add(probe);
  const probeBody = new THREE.Mesh(new RoundedBoxGeometry(0.09, 0.16, 0.06, 4, 0.02), M.shellWarm);
  probeBody.position.y = 0.08; probeBody.castShadow = true; probe.add(probeBody);
  const probeFace = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.03, 0.07, 3, 0.012), M.glass);
  probeFace.position.set(0, 0.165, 0.005); probe.add(probeFace);
  const probeGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.075, 0.05), M.accentGlow);
  probeGlow.position.set(0, 0.182, 0.005);
  probeGlow.rotation.x = -Math.PI / 2;
  probe.add(probeGlow);

  // 扫描锥（挂在探头上，随臂移动）
  const coneMat = new THREE.MeshBasicMaterial({
    color: 0xc2683a, transparent: true, opacity: 0.0, side: THREE.DoubleSide,
    depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const scanCone = new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.0, 40, 1, true), coneMat);
  // 锥尖在原点，向 -Y 展开
  scanCone.geometry.translate(0, -0.5, 0);
  scanCone.position.set(0, 0.18, 0.005);
  scanCone.rotation.x = Math.PI; // 朝 +Y（探头前方）
  scanCone.visible = false;
  probe.add(scanCone);

  // 扫描平面（细环 + 十字），挂在锥前方
  const reticle = new THREE.Group();
  reticle.position.set(0, 0.78, 0.005);
  reticle.visible = false;
  probe.add(reticle);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xd9824f, transparent: true, opacity: 0.9, side: THREE.DoubleSide,
    depthWrite: false, blending: THREE.AdditiveBlending,
  });
  for (let i = 0; i < 2; i++) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.12 + i * 0.09, 0.135 + i * 0.09, 64), ringMat.clone());
    ring.rotation.x = -Math.PI / 2;
    reticle.add(ring);
  }
  const cross = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.006), ringMat.clone());
  cross.rotation.x = -Math.PI / 2;
  reticle.add(cross);
  const cross2 = cross.clone();
  cross2.rotation.z = Math.PI / 2;
  reticle.add(cross2);

  // 感知关键点（漂浮小球 + 细线），随标靶出现
  const keypoints = new THREE.Group();
  reticle.add(keypoints);
  const kpMat = new THREE.MeshBasicMaterial({ color: 0xbfe3ff, transparent: true, opacity: 0.0, depthWrite: false, blending: THREE.AdditiveBlending });
  const lineMat = new THREE.LineBasicMaterial({ color: 0xbfe3ff, transparent: true, opacity: 0.0, depthWrite: false, blending: THREE.AdditiveBlending });
  const kpPts = [
    new THREE.Vector3(0, 0.06, 0.02), new THREE.Vector3(-0.16, 0.02, -0.05),
    new THREE.Vector3(0.16, 0.01, -0.04), new THREE.Vector3(-0.1, -0.04, 0.12),
    new THREE.Vector3(0.12, -0.05, 0.1),
  ];
  kpPts.forEach((p) => {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.012, 10, 10), kpMat.clone());
    s.position.copy(p);
    keypoints.add(s);
  });
  const lineGeo = new THREE.BufferGeometry().setFromPoints(kpPts);
  keypoints.add(new THREE.Line(lineGeo, lineMat));

  // ---------- 动画状态 ----------
  const joints = [j0, j1, j2, j3, j4, j5];
  const current = [...POSE_IDLE.joints] as number[];
  const target = [...POSE_IDLE.joints] as number[];
  let scanT = -99;
  let scanActive = false;

  function triggerScan(now: number) {
    scanT = now;
    scanActive = true;
    target.splice(0, 6, ...POSE_REACH.joints);
    scanCone.visible = true;
    reticle.visible = true;
  }

  function update(dt: number, t: number) {
    // 姿态阻尼
    for (let i = 0; i < 6; i++) current[i] = lerp(current[i], target[i], 1 - Math.pow(0.0018, dt));
    j0.rotation.y = current[0];
    j1.rotation.z = current[1];
    j2.rotation.z = current[2];
    j3.rotation.y = current[3];
    j4.rotation.z = current[4];
    j5.rotation.y = current[5];

    // 扫描：到位后小幅来回扫，随后退回 idle
    const ph = (t - scanT);
    let coneOp = 0;
    if (scanActive) {
      if (ph < 0.15) {
        // 预热
      } else if (ph < 3.4) {
        const sweep = Math.sin((ph - 0.15) * 3.4) * 0.16;
        j2.rotation.z = current[2] + sweep;
        j1.rotation.z = current[1] + Math.sin((ph - 0.15) * 1.7) * 0.05;
        coneOp = 0.22 + Math.sin(t * 6) * 0.04;
      } else {
        target.splice(0, 6, ...POSE_IDLE.joints);
        scanActive = false;
      }
    }
    const coneTarget = scanActive && ph > 0.15 ? coneOp : 0;
    coneMat.opacity = lerp(coneMat.opacity, coneTarget, 0.12);
    const rTarget = scanActive && ph > 0.3 ? 0.95 : 0.0;
    reticle.visible = coneMat.opacity > 0.005;
    reticle.children.forEach((c: any) => {
      if (c.material && c.material !== (keypoints as any)) c.material.opacity = lerp(c.material.opacity ?? 0, rTarget, 0.1);
    });
    keypoints.children.forEach((c: any) => {
      if (c.material) c.material.opacity = lerp(c.material.opacity ?? 0, scanActive ? 0.55 : 0, 0.08);
    });
    // 呼吸灯
    M.accentGlow.emissiveIntensity = 1.2 + Math.sin(t * 2.2) * 0.5;
  }

  function dispose() {
    group.traverse((o: any) => {
      if (o.geometry) o.geometry.dispose();
    });
  }

  return { group, joints, probe, reticle, scanPlane: scanCone as unknown as THREE.Mesh, keypoints, triggerScan, update, dispose };
}
