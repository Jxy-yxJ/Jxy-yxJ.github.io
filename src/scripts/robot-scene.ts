import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { makeMaterials } from './hero/materials';
import { setupEnvironment } from './hero/environment';
import { buildArm } from './hero/arm';
import { buildCompanion } from './hero/companion';
import { buildCharacter } from './hero/character';

export interface RobotSceneOptions {
  reduced: boolean;
}

export async function initRobots(container: HTMLElement, opts: RobotSceneOptions): Promise<() => void> {
  let w = container.clientWidth || 520;
  let h = container.clientHeight || 420;

  const coarse = matchMedia('(pointer: coarse)').matches;
  const narrow = Math.min(window.innerWidth, window.innerHeight) < 720;
  const quality: 'high' | 'low' = !opts.reduced && !coarse && !narrow ? 'high' : 'low';

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === 'high' ? 2 : 1.4));
  renderer.setSize(w, h);
  renderer.setClearAlpha(0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.style.cursor = 'grab';
  container.appendChild(renderer.domElement);
  container.classList.remove('robot-failed');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, w / h, 0.1, 100);
  camera.position.set(0.1, 1.62, 6.6);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.98, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.autoRotate = !opts.reduced;
  controls.autoRotateSpeed = 0.4;
  controls.minPolarAngle = Math.PI * 0.36;
  controls.maxPolarAngle = Math.PI * 0.55;
  controls.minAzimuthAngle = -Math.PI * 0.5;
  controls.maxAzimuthAngle = Math.PI * 0.5;
  controls.rotateSpeed = 0.5;
  controls.update();

  const M = makeMaterials();
  const env = await setupEnvironment(renderer, scene, { hdrUrl: '/env/studio.hdr', quality });

  // ---- 机械臂（科研主体）----
  const arm = buildArm(M);
  arm.group.position.set(-1.15, 0, 0.25);
  arm.group.rotation.y = 0.85;
  arm.group.scale.setScalar(1.0);
  scene.add(arm.group);

  // ---- 小 companion ----
  const companion = buildCompanion(M);
  companion.group.position.set(0.15, 0, 1.15);
  companion.group.scale.setScalar(0.5);
  scene.add(companion.group);

  // ---- 人形角色（GLTF，异步加载）----
  let character: Awaited<ReturnType<typeof buildCharacter>> | null = null;
  const characterRoot = new THREE.Group();
  characterRoot.position.set(1.68, 0, -0.95);
  characterRoot.rotation.y = -0.6;
  scene.add(characterRoot);
  buildCharacter('/models/robot-expressive.glb')
    .then((c) => { character = c; characterRoot.add(c.group); })
    .catch(() => {});

  // ---- 命中盒（点击）----
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const armHit = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.7, 1.4), hitMat);
  armHit.position.y = 0.85; arm.group.add(armHit);
  const charHit = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.7, 1.3), hitMat);
  charHit.position.y = 0.85; characterRoot.add(charHit);
  const compHit = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), hitMat);
  compHit.position.y = 0.4; companion.group.add(compHit);
  const picks = [
    { mesh: armHit, kind: 'arm' as const },
    { mesh: charHit, kind: 'char' as const },
    { mesh: compHit, kind: 'comp' as const },
  ];

  // ---- 交互 ----
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2(2, 2);
  let hoverKind: string | null = null;
  function updateNDC(e: PointerEvent) {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
  }
  function pick(): string | null {
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(picks.map((p) => p.mesh), false);
    return hits.length ? picks.find((p) => p.mesh === hits[0].object)!.kind : null;
  }

  const clock = new THREE.Clock();
  let running = true;
  let raf = 0;
  let prevT = 0;
  let downPos = { x: 0, y: 0 };
  let lastScanAt = -4;

  function startScan(t: number) { arm.triggerScan(t); lastScanAt = t; }

  function loop() {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const t = clock.getElapsedTime();
    const dt = Math.min(t - prevT, 0.05);
    prevT = t;

    controls.update();
    arm.update(dt, t);
    companion.update(dt, t);
    character?.update(dt);

    // 自动扫描：让 hero 始终展示“感知→定位”的动作
    if (t - lastScanAt > 6.5) startScan(t);

    renderer.render(scene, camera);
  }

  if (opts.reduced) {
    renderer.render(scene, camera);
    return () => { arm.dispose(); companion.dispose(); env.dispose(); M.dispose(); renderer.dispose(); renderer.domElement.remove(); };
  }

  const io = new IntersectionObserver(([e]) => { running = e.isIntersecting && !document.hidden; if (running) loop(); }, { threshold: 0.02 });
  io.observe(container);
  document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) loop(); });

  renderer.domElement.addEventListener('pointermove', (e) => {
    updateNDC(e);
    const k = pick();
    if (k !== hoverKind) { hoverKind = k; renderer.domElement.style.cursor = k ? 'pointer' : 'grab'; }
  }, { passive: true });
  renderer.domElement.addEventListener('pointerdown', (e) => { downPos = { x: e.clientX, y: e.clientY }; });
  renderer.domElement.addEventListener('pointerup', (e) => {
    if (Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 6) return;
    updateNDC(e);
    const k = pick();
    if (!k) return;
    const now = clock.getElapsedTime();
    if (k === 'arm') startScan(now);
    if (k === 'char' && character) character.play('Wave', true);
    if (k === 'comp') companion.triggerReact(now);
  });
  renderer.domElement.addEventListener('webglcontextlost', () => container.classList.add('robot-failed'));

  const ro = new ResizeObserver(() => {
    w = container.clientWidth || 520; h = container.clientHeight || 420;
    renderer.setSize(w, h);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  });
  ro.observe(container);

  loop();

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    controls.dispose();
    character?.dispose();
    arm.dispose();
    companion.dispose();
    env.dispose();
    M.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
