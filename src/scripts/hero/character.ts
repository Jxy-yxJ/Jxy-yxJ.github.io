import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface Character {
  group: THREE.Group;
  play(name: string, once?: boolean): void;
  update(dt: number): void;
  dispose(): void;
}

// CC0: "RobotExpressive" by Tomás Laulhé, modified by Don McCurdy (three.js assets).
// 重新着色为站点配色：珍珠白外壳 / 暖灰壳 / 石墨关节（去除卡通橙）。
const PALETTE: Record<string, THREE.MeshPhysicalMaterial> = {
  Main: new THREE.MeshPhysicalMaterial({ color: 0xf3efe8, roughness: 0.36, metalness: 0.05, clearcoat: 0.55, clearcoatRoughness: 0.35, envMapIntensity: 1.0 }),
  Grey: new THREE.MeshPhysicalMaterial({ color: 0xd9d3c8, roughness: 0.5, metalness: 0.1, envMapIntensity: 0.85 }),
  Black: new THREE.MeshPhysicalMaterial({ color: 0x23252b, roughness: 0.32, metalness: 0.85, envMapIntensity: 1.1 }),
};

export async function buildCharacter(url: string): Promise<Character> {
  const gltf = await new GLTFLoader().loadAsync(url);
  const root = gltf.scene;

  root.traverse((o: any) => {
    if (!o.isMesh) return;
    o.castShadow = true;
    o.receiveShadow = true;
    const src = Array.isArray(o.material) ? o.material : [o.material];
    const mapped = src.map((m: any) => PALETTE[m?.name] ?? m);
    o.material = Array.isArray(o.material) ? mapped : mapped[0];
    if (o.material && o.material.side !== undefined) o.material.side = THREE.FrontSide;
  });

  // 归一化：约 1.5 m 高、脚踩地面
  let box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  box.getSize(size);
  const s = 1.35 / (size.y || 1);
  root.scale.setScalar(s);
  box = new THREE.Box3().setFromObject(root);
  root.position.y -= box.min.y;

  const mixer = new THREE.AnimationMixer(root);
  const clips: Record<string, THREE.AnimationClip> = {};
  gltf.animations.forEach((c) => (clips[c.name] = c));

  let current: THREE.AnimationAction | null = null;
  let currentName = '';
  function play(name: string, once = false) {
    const clip = clips[name];
    if (!clip || currentName === name) return;
    const action = mixer.clipAction(clip);
    action.reset();
    action.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat, once ? 1 : Infinity);
    action.clampWhenFinished = once;
    action.setEffectiveWeight(1).fadeIn(0.35).play();
    if (current) current.fadeOut(0.35);
    current = action;
    currentName = name;
    if (once) {
      const back = () => { play('Idle'); mixer.removeEventListener('finished', back); };
      mixer.addEventListener('finished', back);
    }
  }
  play('Idle');

  return {
    group: root,
    play,
    update: (dt: number) => mixer.update(dt),
    dispose() {
      mixer.stopAllAction();
      root.traverse((o: any) => { if (o.geometry) o.geometry.dispose(); });
    },
  };
}
