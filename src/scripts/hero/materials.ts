import * as THREE from 'three';

// 共享 PBR 材质：珍珠白外壳（clearcoat 车漆感）+ 石墨关节 + 赭石强调
export interface HeroMaterials {
  shell: THREE.MeshPhysicalMaterial;
  shellWarm: THREE.MeshPhysicalMaterial;
  joint: THREE.MeshPhysicalMaterial;
  metal: THREE.MeshPhysicalMaterial;
  accent: THREE.MeshStandardMaterial;
  accentGlow: THREE.MeshStandardMaterial;
  glass: THREE.MeshPhysicalMaterial;
  emissive: THREE.MeshStandardMaterial;
  rubber: THREE.MeshStandardMaterial;
  dispose(): void;
}

export function makeMaterials(): HeroMaterials {
  const shell = new THREE.MeshPhysicalMaterial({
    color: 0xf3efe8, roughness: 0.34, metalness: 0.05,
    clearcoat: 0.65, clearcoatRoughness: 0.32, envMapIntensity: 1.05,
  });
  const shellWarm = new THREE.MeshPhysicalMaterial({
    color: 0xe9e2d6, roughness: 0.4, metalness: 0.05,
    clearcoat: 0.5, clearcoatRoughness: 0.4, envMapIntensity: 0.9,
  });
  const joint = new THREE.MeshPhysicalMaterial({
    color: 0x24262c, roughness: 0.3, metalness: 0.85,
    clearcoat: 0.3, clearcoatRoughness: 0.5, envMapIntensity: 1.1,
  });
  const metal = new THREE.MeshPhysicalMaterial({
    color: 0x8a8f98, roughness: 0.28, metalness: 1.0, envMapIntensity: 1.15,
  });
  const accent = new THREE.MeshStandardMaterial({
    color: 0xc2683a, roughness: 0.35, metalness: 0.35,
    emissive: 0x61250f, emissiveIntensity: 0.35,
  });
  const accentGlow = new THREE.MeshStandardMaterial({
    color: 0xd9824f, emissive: 0xd9824f, emissiveIntensity: 1.6, roughness: 0.4,
  });
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x0c0f14, roughness: 0.08, metalness: 0.1,
    clearcoat: 1.0, clearcoatRoughness: 0.06, envMapIntensity: 1.4,
  });
  const emissive = new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: 0xbfe3ff, emissiveIntensity: 1.4, roughness: 0.4,
  });
  const rubber = new THREE.MeshStandardMaterial({ color: 0x1a1c20, roughness: 0.9, metalness: 0.0 });

  return {
    shell, shellWarm, joint, metal, accent, accentGlow, glass, emissive, rubber,
    dispose() {
      [shell, shellWarm, joint, metal, accent, accentGlow, glass, emissive, rubber]
        .forEach((m) => m.dispose());
    },
  };
}
