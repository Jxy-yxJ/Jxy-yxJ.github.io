import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export interface Environment {
  dispose(): void;
}

export interface EnvOptions {
  hdrUrl: string;
  quality: 'high' | 'low';
}

// HDRI 环境贴图（CC0, Poly Haven）+ 三点布光 + 只接收阴影的透明地面
export async function setupEnvironment(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  opts: EnvOptions
): Promise<Environment> {
  scene.background = null; // 保持透明，叠在页面背景上

  // ---- 环境光照（HDRI -> PMREM）----
  const hdr = await new RGBELoader().loadAsync(opts.hdrUrl);
  hdr.mapping = THREE.EquirectangularReflectionMapping;
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envRT = pmrem.fromEquirectangular(hdr);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.7;
  pmrem.dispose();
  hdr.dispose();

  // ---- 三点布光 ----
  const key = new THREE.DirectionalLight(0xfff4e6, 1.55);
  key.position.set(3.2, 5.4, 3.6);
  key.castShadow = true;
  key.shadow.mapSize.set(opts.quality === 'high' ? 2048 : 1024, opts.quality === 'high' ? 2048 : 1024);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 20;
  key.shadow.camera.left = -4;
  key.shadow.camera.right = 4;
  key.shadow.camera.top = 4;
  key.shadow.camera.bottom = -2;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  key.shadow.radius = 3;
  scene.add(key);
  scene.add(key.target);

  const fill = new THREE.DirectionalLight(0xcfe0ff, 0.35);
  fill.position.set(-4.2, 2.4, 2.2);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0xffd9b8, 0.8);
  rim.position.set(-1.6, 3.2, -4.4);
  scene.add(rim);

  const hemi = new THREE.HemisphereLight(0xdfeaff, 0x2a2622, 0.22);
  scene.add(hemi);

  // ---- 只接收阴影的透明地面 ----
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.ShadowMaterial({ opacity: 0.34 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  ground.receiveShadow = true;
  scene.add(ground);

  return {
    dispose() {
      envRT.dispose();
      ground.geometry.dispose();
      (ground.material as THREE.Material).dispose();
      [key, fill, rim, hemi].forEach((l) => l.dispose());
      scene.environment = null;
    },
  };
}
