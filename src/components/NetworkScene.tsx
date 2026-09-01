import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ============================================================================
// PROGRESSIVE NETWORK CONFIGURATION
// Mapping of scroll progress (0.0 to 1.0) to node reveals:
// - At scroll = 0, exactly 1 root node is visible, centered near the top/hero.
// - As scroll increases, new nodes reveal progressively at designated scroll milestones.
// - When a new node reveals, it scales & fades in smoothly, and a connecting line
//   grows from its parent (nearest prior revealed node) to it.
// ============================================================================

export interface NetworkNodeDef {
  id: number;
  pos: [number, number, number]; // [x, y, z] coordinates
  revealProgress: number;        // Scroll threshold (0 to 1) when this node starts revealing
  parentId: number | null;       // The previously revealed node it connects to
}

// 12 curated, elegant node positions spanning from the hero down the entire page.
// The network remains sparse, intentional, and balanced without clutter.
export const NETWORK_NODES: NetworkNodeDef[] = [
  // 1. Initial Root Node visible at scroll = 0 (Hero / Top center)
  { id: 0, pos: [0.0, 0.4, 0.0], revealProgress: 0.0, parentId: null },

  // 2. Nodes revealing through upper sections (About / Skill areas) ~0.08 - 0.28 scroll
  { id: 1, pos: [1.3, 0.8, -1.2], revealProgress: 0.08, parentId: 0 },
  { id: 2, pos: [-1.4, 0.2, -1.8], revealProgress: 0.16, parentId: 0 },
  { id: 3, pos: [0.9, -0.6, -2.6], revealProgress: 0.24, parentId: 1 },
  { id: 4, pos: [-1.1, -0.9, -3.2], revealProgress: 0.32, parentId: 2 },

  // 3. Nodes revealing through mid-page (Projects area) ~0.40 - 0.65 scroll
  { id: 5, pos: [1.6, 0.1, -4.2], revealProgress: 0.40, parentId: 3 },
  { id: 6, pos: [-0.6, 0.7, -5.0], revealProgress: 0.48, parentId: 4 },
  { id: 7, pos: [0.7, -0.4, -6.0], revealProgress: 0.56, parentId: 5 },
  { id: 8, pos: [-1.5, -0.3, -7.0], revealProgress: 0.64, parentId: 6 },

  // 4. Nodes revealing toward lower sections (Testimonials / Contact / Footer) ~0.72 - 0.95 scroll
  { id: 9, pos: [1.2, 0.5, -8.2], revealProgress: 0.72, parentId: 7 },
  { id: 10, pos: [-0.8, -0.6, -9.4], revealProgress: 0.82, parentId: 8 },
  { id: 11, pos: [0.2, 0.2, -10.8], revealProgress: 0.92, parentId: 9 },
];

// Reusable single node mesh with smooth scale & opacity reveal
function ProgressiveNode({
  node,
  scrollProgress,
}: {
  node: NetworkNodeDef;
  scrollProgress: React.MutableRefObject<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(() => {
    const p = scrollProgress.current ?? 0;
    
    // Scale & opacity animation window: fades and scales in over a 0.07 scroll span
    const start = node.revealProgress;
    const duration = 0.07;
    
    let factor = 0;
    if (node.id === 0) {
      factor = 1; // Root node is 100% visible at scroll = 0
    } else if (p >= start) {
      factor = Math.min(1, Math.max(0, (p - start) / duration));
    }

    // Smooth cubic ease-out
    const easeFactor = 1 - Math.pow(1 - factor, 3);

    if (meshRef.current) {
      // Base sphere radius, scales gracefully from 0 to 1
      const scale = easeFactor;
      meshRef.current.scale.set(scale, scale, scale);
      meshRef.current.visible = factor > 0.001;
    }

    if (matRef.current) {
      matRef.current.opacity = easeFactor * 0.72;
      matRef.current.emissiveIntensity = easeFactor * 0.32;
    }
  });

  return (
    <mesh ref={meshRef} position={node.pos}>
      <sphereGeometry args={[0.055, 16, 16]} />
      <meshStandardMaterial
        ref={matRef}
        color="#8B5CF6"
        emissive="#6D28D9"
        emissiveIntensity={0.32}
        roughness={0.4}
        metalness={0.6}
        transparent
        opacity={node.id === 0 ? 0.72 : 0}
      />
    </mesh>
  );
}

// Progressive connecting line that grows from parent node toward the revealed child node
function ProgressiveLine({
  node,
  scrollProgress,
}: {
  node: NetworkNodeDef;
  scrollProgress: React.MutableRefObject<number>;
}) {
  const lineObj = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    const mat = new THREE.LineBasicMaterial({
      color: '#6D28D9',
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const line = new THREE.Line(geom, mat);
    line.visible = false;
    return line;
  }, []);

  const parentNode = useMemo(() => {
    if (node.parentId === null) return null;
    return NETWORK_NODES.find((n) => n.id === node.parentId) || null;
  }, [node.parentId]);

  const pStart = useMemo(
    () => (parentNode ? new THREE.Vector3(...parentNode.pos) : new THREE.Vector3()),
    [parentNode]
  );
  const pEnd = useMemo(() => new THREE.Vector3(...node.pos), [node.pos]);

  const positions = useMemo(() => new Float32Array(6), []);

  useFrame(() => {
    if (!parentNode) return;

    const p = scrollProgress.current ?? 0;
    const start = node.revealProgress;
    const duration = 0.07;

    let factor = 0;
    if (p >= start) {
      factor = Math.min(1, Math.max(0, (p - start) / duration));
    }

    // Line drawing progress with smooth cubic ease-out
    const lineGrowth = 1 - Math.pow(1 - factor, 3);

    if (factor <= 0.001) {
      lineObj.visible = false;
      return;
    }

    lineObj.visible = true;

    // Interpolate end position along the path from parent to child
    const currentEnd = pStart.clone().lerp(pEnd, lineGrowth);

    positions[0] = pStart.x;
    positions[1] = pStart.y;
    positions[2] = pStart.z;
    positions[3] = currentEnd.x;
    positions[4] = currentEnd.y;
    positions[5] = currentEnd.z;

    const attr = lineObj.geometry.attributes.position as THREE.BufferAttribute;
    attr.copyArray(positions);
    attr.needsUpdate = true;

    (lineObj.material as THREE.LineBasicMaterial).opacity = lineGrowth * 0.22;
  });

  if (!parentNode) return null;

  return <primitive object={lineObj} />;
}

export default function NetworkScene({
  scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Extremely subtle, calming ambient floating sway
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.04) * 0.02;
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.03) * 0.015;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. Progressive Connection Lines (Rendered behind nodes) */}
      {NETWORK_NODES.filter((n) => n.parentId !== null).map((node) => (
        <ProgressiveLine
          key={`line-${node.id}`}
          node={node}
          scrollProgress={scrollProgress}
        />
      ))}

      {/* 2. Progressive Nodes */}
      {NETWORK_NODES.map((node) => (
        <ProgressiveNode
          key={`node-${node.id}`}
          node={node}
          scrollProgress={scrollProgress}
        />
      ))}
    </group>
  );
}


