import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Background 3D Network Scene surrounding the character with clean subtle depth
const NODE_COUNT = 45;
const MAX_CONNECTION_DISTANCE = 1.6;
const MAX_CONNECTIONS_PER_NODE = 2;
const PULSE_COUNT = 8;

interface Pulse {
  sourceIndex: number;
  targetIndex: number;
  progress: number;
  speed: number;
  color: THREE.Color;
  active: boolean;
}

export default function TerminalScene() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const pulsesRef = useRef<THREE.Points>(null);

  // 1. Initialize Nodes distributed gracefully in 3D space surrounding the hero character
  const { initialPositions, velocities, baseOffsets, nodeColors } = useMemo(() => {
    const initialPositions = new Float32Array(NODE_COUNT * 3);
    const velocities = new Float32Array(NODE_COUNT * 3);
    const baseOffsets = new Float32Array(NODE_COUNT * 3);
    const nodeColors = new Float32Array(NODE_COUNT * 3);

    const orange = new THREE.Color('#FF4D1A');
    const purple = new THREE.Color('#7C3AED');
    const lightPurple = new THREE.Color('#A855F7');
    const amber = new THREE.Color('#FF7A00');

    for (let i = 0; i < NODE_COUNT; i++) {
      // Cylindrical / volumetric distribution framing the hero view
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.2 + Math.random() * 4.2;
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 1.5;
      const y = (Math.random() - 0.5) * 4.2 - 0.4;
      const z = (Math.random() - 0.5) * 5.0 + 1.0;

      initialPositions[i * 3] = x;
      initialPositions[i * 3 + 1] = y;
      initialPositions[i * 3 + 2] = z;

      // Extremely gentle, calm drift velocities
      velocities[i * 3] = (Math.random() - 0.5) * 0.0006;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.0006;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.0004;

      baseOffsets[i * 3] = Math.random() * Math.PI * 2;
      baseOffsets[i * 3 + 1] = Math.random() * Math.PI * 2;
      baseOffsets[i * 3 + 2] = Math.random() * Math.PI * 2;

      // Soft palette: Neon Orange, Cyber Violet, Amber
      const roll = Math.random();
      let c: THREE.Color;
      if (roll < 0.45) {
        c = orange.clone().lerp(amber, Math.random() * 0.5);
      } else if (roll < 0.85) {
        c = purple.clone().lerp(lightPurple, Math.random() * 0.6);
      } else {
        c = orange.clone().lerp(purple, Math.random());
      }

      nodeColors[i * 3] = c.r;
      nodeColors[i * 3 + 1] = c.g;
      nodeColors[i * 3 + 2] = c.b;
    }

    return { initialPositions, velocities, baseOffsets, nodeColors };
  }, []);

  // Mutable current node positions
  const currentPositions = useRef<Float32Array>(initialPositions.slice());

  // Buffer capacities for dynamic connections (lines)
  const maxLineVertices = NODE_COUNT * MAX_CONNECTIONS_PER_NODE * 2;
  const linePositions = useMemo(() => new Float32Array(maxLineVertices * 3), [maxLineVertices]);
  const lineColors = useMemo(() => new Float32Array(maxLineVertices * 3), [maxLineVertices]);

  // Synaptic signal pulses traveling along connection lines
  const pulses = useRef<Pulse[]>([]);
  const pulsePositions = useMemo(() => new Float32Array(PULSE_COUNT * 3), []);
  const pulseColors = useMemo(() => new Float32Array(PULSE_COUNT * 3), []);

  useMemo(() => {
    pulses.current = [];
    const orange = new THREE.Color('#FF4D1A');
    const purple = new THREE.Color('#A855F7');

    for (let i = 0; i < PULSE_COUNT; i++) {
      pulses.current.push({
        sourceIndex: Math.floor(Math.random() * NODE_COUNT),
        targetIndex: Math.floor(Math.random() * NODE_COUNT),
        progress: Math.random(),
        speed: 0.002 + Math.random() * 0.003,
        color: Math.random() > 0.5 ? orange : purple,
        active: false,
      });
    }
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const pos = currentPositions.current;

    // 1. Update Particle / Node positions with subtle, low-motion drift
    for (let i = 0; i < NODE_COUNT; i++) {
      const idx = i * 3;
      // Very gentle harmonic oscillations
      const waveX = Math.sin(time * 0.12 + baseOffsets[idx]) * 0.0015;
      const waveY = Math.cos(time * 0.10 + baseOffsets[idx + 1]) * 0.0015;
      const waveZ = Math.sin(time * 0.08 + baseOffsets[idx + 2]) * 0.0012;

      pos[idx] += velocities[idx] + waveX;
      pos[idx + 1] += velocities[idx + 1] + waveY;
      pos[idx + 2] += velocities[idx + 2] + waveZ;

      // Soft boundary bounce to keep particles gracefully centered around the character
      if (Math.abs(pos[idx]) > 5.5) velocities[idx] *= -1;
      if (Math.abs(pos[idx + 1]) > 3.8) velocities[idx + 1] *= -1;
      if (pos[idx + 2] < -3.0 || pos[idx + 2] > 4.5) velocities[idx + 2] *= -1;
    }

    // Update Points geometry
    if (pointsRef.current) {
      const pointAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      pointAttr.copyArray(pos);
      pointAttr.needsUpdate = true;
    }

    // 2. Compute dynamic proximity connections (Thin glowing orange & purple lines)
    let vertexCount = 0;
    const orange = new THREE.Color('#FF4D1A');
    const purple = new THREE.Color('#7C3AED');
    const activePairs: [number, number][] = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      let connections = 0;
      const i3 = i * 3;
      const xi = pos[i3];
      const yi = pos[i3 + 1];
      const zi = pos[i3 + 2];

      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (connections >= MAX_CONNECTIONS_PER_NODE) break;
        if (vertexCount >= maxLineVertices - 2) break;

        const j3 = j * 3;
        const dx = xi - pos[j3];
        const dy = yi - pos[j3 + 1];
        const dz = zi - pos[j3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < MAX_CONNECTION_DISTANCE * MAX_CONNECTION_DISTANCE) {
          const dist = Math.sqrt(distSq);
          // Alpha modulation based on proximity
          const alpha = 1.0 - dist / MAX_CONNECTION_DISTANCE;
          const subtleAlpha = Math.max(0, alpha * 0.45);

          // Node i vertex
          linePositions[vertexCount * 3] = xi;
          linePositions[vertexCount * 3 + 1] = yi;
          linePositions[vertexCount * 3 + 2] = zi;

          // Node j vertex
          linePositions[(vertexCount + 1) * 3] = pos[j3];
          linePositions[(vertexCount + 1) * 3 + 1] = pos[j3 + 1];
          linePositions[(vertexCount + 1) * 3 + 2] = pos[j3 + 2];

          // Blend node colors for connection line
          const cA = (i % 2 === 0 ? orange : purple).clone().multiplyScalar(subtleAlpha);
          const cB = (j % 2 === 0 ? purple : orange).clone().multiplyScalar(subtleAlpha);

          lineColors[vertexCount * 3] = cA.r;
          lineColors[vertexCount * 3 + 1] = cA.g;
          lineColors[vertexCount * 3 + 2] = cA.b;
          lineColors[(vertexCount + 1) * 3] = cB.r;
          lineColors[(vertexCount + 1) * 3 + 1] = cB.g;
          lineColors[(vertexCount + 1) * 3 + 2] = cB.b;

          activePairs.push([i, j]);
          vertexCount += 2;
          connections++;
        }
      }
    }

    // Update LineSegments geometry
    if (linesRef.current) {
      const linePosAttr = linesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const lineColAttr = linesRef.current.geometry.attributes.color as THREE.BufferAttribute;
      linePosAttr.copyArray(linePositions);
      lineColAttr.copyArray(lineColors);
      linesRef.current.geometry.setDrawRange(0, vertexCount);
      linePosAttr.needsUpdate = true;
      lineColAttr.needsUpdate = true;
    }

    // 3. Animate Synaptic Pulses traveling between connected nodes
    if (activePairs.length > 0) {
      for (let p = 0; p < PULSE_COUNT; p++) {
        const pulse = pulses.current[p];
        if (!pulse.active || Math.random() < 0.01) {
          const pair = activePairs[Math.floor(Math.random() * activePairs.length)];
          pulse.sourceIndex = pair[0];
          pulse.targetIndex = pair[1];
          pulse.progress = 0;
          pulse.active = true;
        }

        pulse.progress += pulse.speed;
        if (pulse.progress >= 1.0) {
          pulse.active = false;
          pulse.progress = 0;
        }

        const sIdx = pulse.sourceIndex * 3;
        const tIdx = pulse.targetIndex * 3;
        const tVal = pulse.progress;

        const px = pos[sIdx] + (pos[tIdx] - pos[sIdx]) * tVal;
        const py = pos[sIdx + 1] + (pos[tIdx + 1] - pos[sIdx + 1]) * tVal;
        const pz = pos[sIdx + 2] + (pos[tIdx + 2] - pos[sIdx + 2]) * tVal;

        pulsePositions[p * 3] = px;
        pulsePositions[p * 3 + 1] = py;
        pulsePositions[p * 3 + 2] = pz;

        // Subtle luminous pulse point
        pulseColors[p * 3] = pulse.color.r * 0.9;
        pulseColors[p * 3 + 1] = pulse.color.g * 0.9;
        pulseColors[p * 3 + 2] = pulse.color.b * 0.9;
      }
    }

    if (pulsesRef.current) {
      const pulsePosAttr = pulsesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const pulseColAttr = pulsesRef.current.geometry.attributes.color as THREE.BufferAttribute;
      pulsePosAttr.copyArray(pulsePositions);
      pulseColAttr.copyArray(pulseColors);
      pulsePosAttr.needsUpdate = true;
      pulseColAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* 1. Intelligent Network Nodes (Delicate subtle presence) */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[initialPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[nodeColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          vertexColors
          transparent
          opacity={0.32}
          sizeAttenuation
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 2. Delicate Glowing Connection Lines (Subtle accents) */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.22}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* 3. Synaptic Signal Pulses */}
      <points ref={pulsesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pulsePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[pulseColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          vertexColors
          transparent
          opacity={0.42}
          sizeAttenuation
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
