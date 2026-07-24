import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { buildHumanoid } from './robots/humanoid';
import { buildCompanion } from './robots/companion';

export interface RobotSceneOptions {
  reduced: boolean;
}

// 假接地阴影（径向渐变贴图平面，避免开启阴影贴图）
function makeGroundShadow(): THREE.Mesh {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 10, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(0,0,0,0.35)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4.6, 4.6),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.001;
  return mesh;
}

export async function initRobots(container: HTMLElement, opts: RobotSceneOptions): Promise<void> {
  let w = container.clientWidth || 420;
  let h = container.clientHeight || 320;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setSize(w, h);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);
  container.classList.remove('robot-failed');

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 50);
  camera.position.set(0, 1.35, 6.8);
  camera.lookAt(0, 1.0, 0);

  const key = new THREE.DirectionalLight(0xffffff, 1.15);
  key.position.set(3, 6, 4);
  scene.add(key);
  scene.add(new THREE.AmbientLight(0xffffff, 0.32));
  scene.add(makeGroundShadow());

  // ---- 双机器人 ----
  const big = buildHumanoid();
  big.group.position.set(0.95, 0, -0.55);
  big.group.rotation.y = -0.4;
  scene.add(big.group);

  const small = buildCompanion();
  small.group.position.set(-1.2, 0, 0.95);
  small.group.scale.setScalar(0.6);
  scene.add(small.group);

  // ---- 命中盒（点击交互）----
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2(0, 0);
  const bigHit = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.5, 1.1), new THREE.MeshBasicMaterial({ visible: false }));
  bigHit.position.y = 1.2;
  big.group.add(bigHit);
  const smallHit = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.7, 1.5), new THREE.MeshBasicMaterial({ visible: false }));
  smallHit.position.y = 0.6;
  small.group.add(smallHit);
  const hitList = [
    { mesh: bigHit, who: 'big' as const },
    { mesh: smallHit, who: 'small' as const },
  ];

  // ---- 注视/动画状态 ----
  const look = { bigYaw: 0, bigPitch: 0, smallYaw: 0, smallPitch: 0 };
  const target = { ...look };
  let bigReactT = -10;
  let smallReactT = -10;
  let nextBlinkBig = 2 + Math.random() * 3;
  let nextBlinkSmall = 1 + Math.random() * 3;
  let bigBlinkT = -10;
  let smallBlinkT = -10;

  const chestMat = big.parts.chest.material as THREE.MeshStandardMaterial;
  const smallBaseRotY = 0;

  function setNDC(e: PointerEvent) {
    const r = renderer.domElement.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 2 - 1;
    const y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    ndc.set(THREE.MathUtils.clamp(x, -1, 1), THREE.MathUtils.clamp(y, -1, 1));
  }

  // ---- reduced-motion：静态一帧 ----
  if (opts.reduced) {
    renderer.render(scene, camera);
    const ro0 = new ResizeObserver(() => {
      renderer.setSize(container.clientWidth || 420, container.clientHeight || 320);
      camera.aspect = (container.clientWidth || 420) / (container.clientHeight || 320);
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    });
    ro0.observe(container);
    return;
  }

  window.addEventListener('pointermove', setNDC, { passive: true });
  renderer.domElement.addEventListener('pointerdown', (e) => {
    setNDC(e);
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(hitList.map((h) => h.mesh), false);
    if (!hits.length) return;
    const who = hitList.find((h) => h.mesh === hits[0].object)?.who;
    const now = clock.getElapsedTime();
    if (who === 'big') bigReactT = now;
    if (who === 'small') smallReactT = now;
  });

  renderer.domElement.addEventListener('webglcontextlost', () => {
    container.classList.add('robot-failed');
  });

  const clock = new THREE.Clock();
  let running = true;
  let raf = 0;
  let prevT = 0;

  const io = new IntersectionObserver(([entry]) => {
    running = entry.isIntersecting && !document.hidden;
    if (running) loop();
  }, { threshold: 0.05 });
  io.observe(container);
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) loop();
  });

  const ro = new ResizeObserver(() => {
    w = container.clientWidth || 420;
    h = container.clientHeight || 320;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
  ro.observe(container);

  const damp = (cur: number, tgt: number, k: number) => cur + (tgt - cur) * k;

  function blinkScale(t: number, start: number): number {
    const phase = (t - start) / 0.16;
    if (phase < 0 || phase >= 1) return 1;
    return 1 - Math.sin(phase * Math.PI) * 0.9;
  }

  function loop() {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const t = clock.getElapsedTime();
    const dt = Math.min(t - prevT, 0.05);
    prevT = t;

    // ---- 注视目标 ----
    target.bigYaw = ndc.x * 0.55;
    target.bigPitch = -ndc.y * 0.3;
    target.smallYaw = ndc.x * 0.85;
    target.smallPitch = -ndc.y * 0.5;

    // 小机器人偶尔偷看大机器人（萌点）
    const glancePhase = t % 12;
    let smallYawTgt = target.smallYaw;
    let smallPitchTgt = target.smallPitch;
    if (glancePhase < 1.8 && smallReactT < t - 1) {
      const dir = Math.atan2(big.group.position.x - small.group.position.x, big.group.position.z - small.group.position.z);
      smallYawTgt = dir - small.group.rotation.y;
      smallPitchTgt = 0.05;
    }

    look.bigYaw = damp(look.bigYaw, target.bigYaw, 0.07);
    look.bigPitch = damp(look.bigPitch, target.bigPitch, 0.07);
    look.smallYaw = damp(look.smallYaw, smallYawTgt, 0.12);
    look.smallPitch = damp(look.smallPitch, smallPitchTgt, 0.12);

    big.parts.head.rotation.y = look.bigYaw;
    big.parts.head.rotation.x = look.bigPitch;
    small.parts.head.rotation.y = look.smallYaw;
    small.parts.head.rotation.x = look.smallPitch;
    // 眼杆一起跟
    small.parts.stalkL.rotation.y = look.smallYaw * 0.4;
    small.parts.stalkR.rotation.y = look.smallYaw * 0.4;

    // ---- 待机 ----
    big.group.position.y = Math.sin(t * 0.9) * 0.025; // 呼吸浮动
    chestMat.emissiveIntensity = 1.0 + Math.sin(t * 1.6) * 0.5; // 呼吸灯
    small.group.rotation.z = Math.sin(t * 1.2) * 0.03; // 轻微摇晃
    small.parts.body.rotation.y = Math.sin(t * 0.5) * 0.05;

    // ---- 眨眼 ----
    if (t > nextBlinkBig) { bigBlinkT = t; nextBlinkBig = t + 2.5 + Math.random() * 3; }
    if (t > nextBlinkSmall) { smallBlinkT = t; nextBlinkSmall = t + 1.8 + Math.random() * 3; }
    const bsBig = blinkScale(t, bigBlinkT);
    big.parts.eyeL.scale.y = bsBig;
    big.parts.eyeR.scale.y = bsBig;
    const bsSmall = blinkScale(t, smallBlinkT);
    small.parts.pupilL.scale.y = bsSmall;
    small.parts.pupilR.scale.y = bsSmall;

    // ---- 大机器人点击反应：点头 + 挥手 + 胸口闪亮 ----
    const bigPhase = (t - bigReactT) / 0.9;
    if (bigPhase >= 0 && bigPhase < 1) {
      const nod = Math.sin(bigPhase * Math.PI);
      big.parts.head.rotation.x -= nod * 0.28;
      big.parts.shoulderR.rotation.z = -(0.6 + Math.sin(bigPhase * Math.PI * 4) * 0.5);
      chestMat.emissiveIntensity = 1.0 + (1 - bigPhase) * 2.0;
    } else {
      big.parts.shoulderR.rotation.z = damp(big.parts.shoulderR.rotation.z, 0, 0.15);
    }

    // ---- 小机器人点击反应：跳起 + 空中转圈 + 笑眼 ----
    const smallPhase = (t - smallReactT) / 0.8;
    if (smallPhase >= 0 && smallPhase < 1) {
      small.group.position.y = Math.sin(smallPhase * Math.PI) * 0.55;
      small.group.rotation.y = smallBaseRotY + smallPhase * Math.PI * 2;
      small.parts.pupilL.scale.y = 0.45;
      small.parts.pupilR.scale.y = 0.45;
    } else {
      small.group.position.y = damp(small.group.position.y, 0, 0.2);
      small.group.rotation.y = smallBaseRotY;
    }

    renderer.render(scene, camera);
  }
  loop();

  // 组件销毁时清理（Astro MPA 整页刷新，主要靠页面卸载；这里兜底）
  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    window.removeEventListener('pointermove', setNDC);
    renderer.dispose();
    pmrem.dispose();
  };
}
