import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useScroll, useSpring, motion } from 'motion/react';
import * as THREE from 'three';
import { useScrollAnimation } from '../utils/motion';
import {
  AlertCircle,
  Users,
  Lightbulb,
  Palette,
  Cpu,
  Code2,
  LucideIcon,
} from 'lucide-react';

interface ConceptLocation {
  id: string;
  number: string;
  label: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  color: string;
  glowColor: string;
  pos: [number, number, number];
  cameraStopZ: number;
}

const WORLD_CONCEPTS: ConceptLocation[] = [
  {
    id: 'problem',
    number: '01',
    label: 'PROBLEM',
    tagline: 'Understanding the Real Need',
    description: "Breaking down what's actually broken before touching a solution.",
    icon: AlertCircle,
    color: '#FF4D1A',
    glowColor: 'rgba(255, 77, 26, 0.7)',
    pos: [-0.5, 0.3, -6.0],
    cameraStopZ: 1.5,
  },
  {
    id: 'user',
    number: '02',
    label: 'USER',
    tagline: 'Designing for People',
    description: 'Understanding how someone will actually use this, not just how it looks.',
    icon: Users,
    color: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.7)',
    pos: [0.5, -0.2, -24.0],
    cameraStopZ: -16.5,
  },
  {
    id: 'idea',
    number: '03',
    label: 'IDEA',
    tagline: 'Exploring the Options',
    description: 'Weighing different approaches before committing to one.',
    icon: Lightbulb,
    color: '#FF7A00',
    glowColor: 'rgba(255, 122, 0, 0.7)',
    pos: [-0.45, -0.15, -42.0],
    cameraStopZ: -34.5,
  },
  {
    id: 'design',
    number: '04',
    label: 'DESIGN',
    tagline: 'Precision Craft & Physics',
    description: 'Orchestrating spatial rhythm, optical typography, and responsive micro-interactions.',
    icon: Palette,
    color: '#C084FC',
    glowColor: 'rgba(192, 132, 252, 0.7)',
    pos: [0.45, 0.3, -60.0],
    cameraStopZ: -52.5,
  },
  {
    id: 'ai',
    number: '05',
    label: 'AI',
    tagline: 'Making It Smarter',
    description: 'Integrating AI where it genuinely improves the product, not as a gimmick.',
    icon: Cpu,
    color: '#7C3AED',
    glowColor: 'rgba(124, 58, 237, 0.7)',
    pos: [-0.5, 0.25, -78.0],
    cameraStopZ: -70.5,
  },
  {
    id: 'engineering',
    number: '06',
    label: 'BUILD',
    tagline: 'Clean Code & Architecture',
    description: 'Writing clean, performant frontend code that scales.',
    icon: Code2,
    color: '#FF4D1A',
    glowColor: 'rgba(255, 77, 26, 0.7)',
    pos: [0.45, -0.15, -96.0],
    cameraStopZ: -88.5,
  },
];

const DESTINATION_Z = -118.0;

// Continuous 3D Spline Path with flattened X-axis oscillation (mostly forward glide in Z)
const SPLINE_WAYPOINTS = [
  new THREE.Vector3(0, 0.4, 10.0),
  new THREE.Vector3(-0.25, 0.35, 0.0),
  new THREE.Vector3(-0.5, 0.3, -6.0), // PROBLEM
  new THREE.Vector3(-0.1, 0.1, -15.0),
  new THREE.Vector3(0.5, -0.2, -24.0), // USER
  new THREE.Vector3(0.1, -0.15, -33.0),
  new THREE.Vector3(-0.45, -0.15, -42.0), // IDEA
  new THREE.Vector3(-0.05, 0.1, -51.0),
  new THREE.Vector3(0.45, 0.3, -60.0), // DESIGN
  new THREE.Vector3(0.1, 0.25, -69.0),
  new THREE.Vector3(-0.5, 0.25, -78.0), // AI
  new THREE.Vector3(-0.1, 0.05, -87.0),
  new THREE.Vector3(0.45, -0.15, -96.0), // ENGINEERING / BUILD
  new THREE.Vector3(0.15, 0.0, -106.0),
  new THREE.Vector3(0.0, 0.0, DESTINATION_Z), // PRODUCT
];

// Deep Space Dust & Star Particles that look like floating in the night sky full of stars
function SpaceEnvironmentParticles() {
  const count = 200;
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const starColors = [
      new THREE.Color('#FFFFFF'), // Pure bright star
      new THREE.Color('#E2ECFF'), // Soft blue star
      new THREE.Color('#FFF6E6'), // Warm starlight
      new THREE.Color('#D8B4FE'), // Soft purple stardust
      new THREE.Color('#93C5FD'), // Celestial blue dust
    ];
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 36;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 2] = 14 - Math.random() * 145; // Spanning full length of world
      const c = starColors[Math.floor(Math.random() * starColors.length)];
      col[i * 3 + 0] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      // Gentle, slowed rotation
      pointsRef.current.rotation.z = state.clock.getElapsedTime() * 0.0025;
      pointsRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.002) * 0.006;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Glowing 3D Synaptic Spline Path that winds through the universe
function GlowingSynapticPath() {
  const spline = useMemo(() => {
    return new THREE.CatmullRomCurve3(SPLINE_WAYPOINTS, false, 'catmullrom', 0.4);
  }, []);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(spline, 240, 0.035, 8, false);
  }, [spline]);

  const pathLineGeometry = useMemo(() => {
    const pts = spline.getPoints(300);
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [spline]);

  // Travelling energy pulse on the path - slightly slowed for comfortable reading
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (pulseRef.current) {
      const t = (state.clock.getElapsedTime() * 0.065) % 1;
      const pt = spline.getPointAt(t);
      pulseRef.current.position.copy(pt);
    }
  });

  return (
    <group>
      {/* Outer Core Glowing Tube */}
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial
          color="#FF7A00"
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Radiant High-Energy Filament */}
      <primitive
        object={
          new THREE.Line(
            pathLineGeometry,
            new THREE.LineBasicMaterial({
              color: '#A855F7',
              transparent: true,
              opacity: 0.6,
              blending: THREE.AdditiveBlending,
            })
          )
        }
      />

      {/* Moving Synaptic Spark */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// Dense Active Neural Subsystem for the AI Node with traveling signals
function AIDenseNeuralCluster({ active }: { active: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Generate dense micro-network surrounding the AI node
  const { nodePositions, linePositions, signalTrajectories } = useMemo(() => {
    const rawNodes: THREE.Vector3[] = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      const radius = 0.6 + Math.random() * 1.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      rawNodes.push(
        new THREE.Vector3(
          radius * Math.cos(theta) * Math.cos(phi),
          radius * Math.sin(phi) + 0.1,
          radius * Math.sin(theta) * Math.cos(phi)
        )
      );
    }

    const segments: [THREE.Vector3, THREE.Vector3][] = [];
    const trajectories: { start: THREE.Vector3; end: THREE.Vector3; speed: number; progress: number }[] = [];

    rawNodes.forEach((n, i) => {
      // Connect each node to nearest 2 neighbors
      const neighbors = rawNodes
        .map((other, j) => ({ j, d: n.distanceTo(other) }))
        .filter((entry) => entry.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);

      neighbors.forEach(({ j }) => {
        segments.push([n, rawNodes[j]]);
        trajectories.push({
          start: n,
          end: rawNodes[j],
          speed: 0.5 + Math.random() * 0.7,
          progress: Math.random(),
        });
      });
    });

    const lPos = new Float32Array(segments.length * 6);
    segments.forEach(([a, b], idx) => {
      lPos[idx * 6 + 0] = a.x;
      lPos[idx * 6 + 1] = a.y;
      lPos[idx * 6 + 2] = a.z;
      lPos[idx * 6 + 3] = b.x;
      lPos[idx * 6 + 4] = b.y;
      lPos[idx * 6 + 5] = b.z;
    });

    const nPos = new Float32Array(rawNodes.length * 3);
    rawNodes.forEach((n, idx) => {
      nPos[idx * 3 + 0] = n.x;
      nPos[idx * 3 + 1] = n.y;
      nPos[idx * 3 + 2] = n.z;
    });

    return {
      nodePositions: nPos,
      linePositions: lPos,
      signalTrajectories: trajectories,
    };
  }, []);

  // Buffer for traveling signal packets
  const signalPosBuffer = useMemo(() => {
    return new Float32Array(signalTrajectories.length * 3);
  }, [signalTrajectories.length]);

  const scratchVec = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    if (!active || !pointsRef.current) return;

    signalTrajectories.forEach((traj, idx) => {
      traj.progress = (traj.progress + delta * traj.speed) % 1.0;
      scratchVec.lerpVectors(traj.start, traj.end, traj.progress);
      signalPosBuffer[idx * 3 + 0] = scratchVec.x;
      signalPosBuffer[idx * 3 + 1] = scratchVec.y;
      signalPosBuffer[idx * 3 + 2] = scratchVec.z;
    });

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <group>
      {/* Dense Synaptic Connecting Filaments */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#A855F7"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Synaptic Junction Spheres */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nodePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#FF7A00"
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Traveling Glowing Signals Through the AI Neural Network */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[signalPosBuffer, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.09}
          color="#FFFFFF"
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// Individual 3D Concept Landmark in the World
function WorldConceptNode({
  concept,
  cameraZ,
}: {
  concept: ConceptLocation;
  cameraZ: number;
}) {
  const Icon = concept.icon;
  const nodeZ = concept.pos[2];

  // Calculate distance from camera to this concept along Z-axis
  const distFromCamera = cameraZ - nodeZ;

  // STRICT LEGIBILITY LOGIC: Approach distance and early cutoff before steep 3D perspective scale-up
  const READABLE_FAR = 13; // start fading in this many units before reaching the node
  const READABLE_NEAR = 1.6; // stop rendering before the camera gets too close (avoids extreme perspective scale-up)
  const FADE_IN_SPAN = 3.5;
  const FADE_OUT_SPAN = 1.8;

  const isReadable = distFromCamera <= READABLE_FAR && distFromCamera >= READABLE_NEAR;
  const textOpacity = isReadable
    ? distFromCamera > READABLE_FAR - FADE_IN_SPAN
      ? (READABLE_FAR - distFromCamera) / FADE_IN_SPAN
      : distFromCamera < READABLE_NEAR + FADE_OUT_SPAN
      ? (distFromCamera - READABLE_NEAR) / FADE_OUT_SPAN
      : 1
    : 0;

  const beaconOpacity = distFromCamera > 0 ? Math.min(0.8, 15 / Math.max(1, distFromCamera)) : 0;
  const isAI = concept.id === 'ai';

  // AI Phased reveal states based on approach progress
  const aiFirstStatementVisible = isAI && distFromCamera <= 12;
  const aiSecondStatementVisible = isAI && distFromCamera <= 9.5;

  return (
    <group position={concept.pos}>
      {/* Dense Active Neural Cluster specifically for AI */}
      {isAI && <AIDenseNeuralCluster active={distFromCamera <= 14 && distFromCamera >= -6} />}

      {/* 3D Glowing Core Orb */}
      <mesh>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshBasicMaterial color={concept.color} />
      </mesh>

      {/* Outer Soft Radiant Glow */}
      <mesh>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshBasicMaterial
          color={concept.color}
          transparent
          opacity={beaconOpacity * 0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* HTML Spatial Typography Billboard - Using GPU-accelerated 3D transform */}
      {isReadable && (
        <Html
          position={[0, 0, 0]}
          center
          transform
          distanceFactor={7}
          zIndexRange={[100, 0]}
        >
          <div
            style={{
              opacity: textOpacity,
            }}
            className="pointer-events-none select-none transition-opacity duration-150 w-[260px] sm:w-[340px] md:w-[400px] px-3 text-center mx-auto"
          >
            {/* Ambient Backlight Halo - Optimized pre-blurred radial gradient without live CSS blur */}
            <div
              aria-hidden="true"
              style={{
                background: `radial-gradient(circle, ${concept.glowColor} 0%, rgba(0,0,0,0) 70%)`,
              }}
              className="absolute w-40 h-40 -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60 pointer-events-none"
            />

            {/* AI Phased Statement Reveal - Static position */}
            {isAI ? (
              <div className="space-y-1.5 mb-3 text-center">
                {/* Statement 1 */}
                <div
                  style={{
                    opacity: aiFirstStatementVisible ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                  }}
                  className="text-xs sm:text-sm font-mono tracking-widest uppercase text-zinc-300 font-bold"
                >
                  I DON'T JUST USE AI.
                </div>
                {/* Statement 2 */}
                <div
                  style={{
                    opacity: aiSecondStatementVisible ? 1 : 0,
                    transition: 'opacity 0.4s ease 0.1s',
                  }}
                  className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF7A00] to-[#FF4D1A] drop-shadow-md"
                >
                  I BUILD WITH IT.
                </div>
              </div>
            ) : null}

            {/* Minimalist Icon Badge - Solid high-contrast background without expensive backdrop filter */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <div
                style={{
                  borderColor: `${concept.color}50`,
                  boxShadow: `0 0 20px ${concept.glowColor}`,
                }}
                className="w-9 h-9 rounded-xl bg-[#0F0E14] border flex items-center justify-center"
              >
                <Icon style={{ color: concept.color }} className="w-4 h-4" />
              </div>
            </div>

            {/* Concept Primary Heading */}
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-sans drop-shadow-xl leading-tight text-center">
              {concept.label}
            </h3>

            {/* Subtitle / Method Insight */}
            <p
              style={{ color: concept.color }}
              className="mt-1 text-xs sm:text-sm font-semibold tracking-wide text-center"
            >
              {concept.tagline}
            </p>

            {/* Concise Deep Philosophy */}
            <p className="mt-2 text-[11.5px] sm:text-xs text-zinc-300 leading-relaxed drop-shadow text-center max-w-[210px] sm:max-w-[260px] mx-auto [text-wrap:balance]">
              {concept.description}
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}

// Glowing Convergent Crystal Structure & Inward Beams at PRODUCT
function ConvergentCrystalNexus({ opacity }: { opacity: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.75;
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.x += delta * 1.1;
      ringRef1.current.rotation.z += delta * 0.8;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.y -= delta * 1.3;
      ringRef2.current.rotation.z -= delta * 0.9;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y -= delta * 0.5;
      const s = 1.0 + Math.sin(state.clock.elapsedTime * 3) * 0.08;
      coreRef.current.scale.set(s, s, s);
    }
  });

  // Converging node ray lines from the 6 previous coordinates into the center
  const rayGeometry = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const sourcePoints = [
      new THREE.Vector3(-0.5, 0.3, 112.0),
      new THREE.Vector3(0.5, -0.2, 94.0),
      new THREE.Vector3(-0.45, -0.15, 76.0),
      new THREE.Vector3(0.45, 0.3, 58.0),
      new THREE.Vector3(-0.5, 0.25, 40.0),
      new THREE.Vector3(0.45, -0.15, 22.0),
    ];
    sourcePoints.forEach((sp) => {
      // Relative offset to PRODUCT position
      pts.push(sp.clone().multiplyScalar(0.08));
      pts.push(new THREE.Vector3(0, 0, 0));
    });
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  if (opacity <= 0.01) return null;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Converging neural rays */}
      <primitive
        object={
          new THREE.LineSegments(
            rayGeometry,
            new THREE.LineBasicMaterial({
              color: '#FF7A00',
              transparent: true,
              opacity: opacity * 0.65,
              blending: THREE.AdditiveBlending,
            })
          )
        }
      />

      {/* Central Luminous Octahedron Core */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.32, 0]} />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={opacity * 0.95}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Radiant Outer Geometric Lattice */}
      <mesh>
        <octahedronGeometry args={[0.42, 0]} />
        <meshBasicMaterial
          color="#FF4D1A"
          wireframe
          transparent
          opacity={opacity * 0.85}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Orbiting Neural Resonance Ring 1 (Purple) */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[0.62, 0.018, 16, 48]} />
        <meshBasicMaterial
          color="#A855F7"
          transparent
          opacity={opacity * 0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Orbiting Neural Resonance Ring 2 (Orange) */}
      <mesh ref={ringRef2}>
        <torusGeometry args={[0.75, 0.015, 16, 48]} />
        <meshBasicMaterial
          color="#FF7A00"
          transparent
          opacity={opacity * 0.75}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// Destination: PRODUCT (At Z = -118)
function DestinationProductNode({ cameraZ }: { cameraZ: number }) {
  const distFromCamera = cameraZ - DESTINATION_Z;
  const isVisible = distFromCamera <= 18;
  const opacity = isVisible ? Math.min(1, (18 - distFromCamera) / 8) : 0;

  return (
    <group position={[0, 0, DESTINATION_Z]}>
      {/* Radiant Central Nexus */}
      <mesh>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshBasicMaterial color="#FF4D1A" />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshBasicMaterial
          color="#A855F7"
          transparent
          opacity={opacity * 0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Luminous Convergent Crystal Structure & Converging Node Filaments */}
      <ConvergentCrystalNexus opacity={opacity} />

      {/* 3D Typographic PRODUCT Reveal */}
      {isVisible && (
        <Html position={[0, 0, 0]} center transform distanceFactor={7} zIndexRange={[100, 0]}>
          <div
            style={{
              opacity,
            }}
            className="pointer-events-none select-none text-center w-[270px] sm:w-[380px] md:w-[480px] px-3 transition-opacity duration-200"
          >
            {/* Contrast-enhancing Circular Scrim Backdrop - High contrast solid/radial blend */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] md:w-[500px] md:h-[500px] rounded-full bg-radial from-[#08080C]/92 via-[#08080C]/80 to-transparent -z-10 pointer-events-none shadow-[0_0_60px_rgba(0,0,0,0.85)]"
            />

            {/* Ambient Glow */}
            <div
              aria-hidden="true"
              className="absolute -inset-20 rounded-full bg-radial from-[#FF4D1A]/15 via-[#7C3AED]/10 to-transparent -z-20 pointer-events-none"
            />

            {/* Grand Monumental PRODUCT Wordmark */}
            <h3 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight font-sans drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-300">
                PROD
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6E38] via-[#FFA14A] to-[#C084FC]">
                UCT
              </span>
            </h3>

            {/* Culmination Philosophy Statement */}
            <p className="mt-3 text-[11.5px] sm:text-xs md:text-sm text-zinc-200 font-medium max-w-[230px] sm:max-w-[320px] md:max-w-md mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] [text-wrap:balance]">
              Where the idea, the user, and the code come together into something that actually works.
            </p>

            {/* Core Pillars */}
            <div className="mt-6 flex items-center justify-center gap-3 text-[10px] sm:text-xs font-mono tracking-widest uppercase text-zinc-400 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              <span className="text-[#FF6E38] font-semibold">Problem</span>
              <span className="text-zinc-600">&bull;</span>
              <span className="text-[#A855F7]">User</span>
              <span className="text-zinc-600">&bull;</span>
              <span className="text-white font-semibold">AI</span>
              <span className="text-zinc-600">&bull;</span>
              <span className="text-[#FFA14A] font-semibold">Ship</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Helper function to find spline's normalized t parameter for a given target Z depth with high precision
function findTForZ(spline: THREE.CatmullRomCurve3, targetZ: number, samples = 2000): number {
  let closestT = 0;
  let closestDist = Infinity;
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const pt = spline.getPointAt(t);
    const dist = Math.abs(pt.z - targetZ);
    if (dist < closestDist) {
      closestDist = dist;
      closestT = t;
    }
  }
  return closestT;
}

interface JourneySegment {
  pTravelStart: number;
  pTravelEnd: number;
  pPauseStart: number;
  pPauseEnd: number;
  fromT: number;
  targetT: number;
}

// Maps continuous scroll progress (0..1) to camera t on spline with stable pause plateaus at each concept
function sampleJourneyProgress(p: number, segments: JourneySegment[]): number {
  const clampedP = Math.max(0, Math.min(1, p));

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];

    // Inside travel window: smooth cubic ease from fromT to targetT (starts and ends at zero velocity)
    if (clampedP >= seg.pTravelStart && clampedP < seg.pPauseStart) {
      const u = (clampedP - seg.pTravelStart) / Math.max(0.0001, seg.pTravelEnd - seg.pTravelStart);
      const clampedU = Math.max(0, Math.min(1, u));
      const eased = clampedU * clampedU * (3 - 2 * clampedU);
      return THREE.MathUtils.lerp(seg.fromT, seg.targetT, eased);
    }

    // Inside pause plateau: 100% constant, rock-solid stability at the exact concept view distance
    if (clampedP >= seg.pPauseStart && clampedP <= seg.pPauseEnd) {
      return seg.targetT;
    }
  }

  return segments[segments.length - 1].targetT;
}

// Continuous 3D Flight Camera Rig with Concept Pauses & Stability
function FlightCamera({
  scrollProgress,
  onCameraUpdate,
}: {
  scrollProgress: React.MutableRefObject<number>;
  onCameraUpdate: (z: number) => void;
}) {
  const { camera } = useThree();
  const spline = useMemo(() => {
    return new THREE.CatmullRomCurve3(SPLINE_WAYPOINTS, false, 'catmullrom', 0.4);
  }, []);

  // Compute exact t on the spline for each concept's optimal reading distance (cameraStopZ)
  const segments: JourneySegment[] = useMemo(() => {
    const conceptTs = WORLD_CONCEPTS.map((c) => findTForZ(spline, c.cameraStopZ, 2000));
    const tProduct = findTForZ(spline, DESTINATION_Z + 8.5, 2000);

    const stops = [
      conceptTs[0], // Problem (cameraStopZ = 1.5)
      conceptTs[1], // User (cameraStopZ = -16.5)
      conceptTs[2], // Idea (cameraStopZ = -34.5)
      conceptTs[3], // Design (cameraStopZ = -52.5)
      conceptTs[4], // AI (cameraStopZ = -70.5)
      conceptTs[5], // Build (cameraStopZ = -88.5)
      tProduct,     // Product
    ];

    // Scroll schedule: deliberate flight toward concept, followed by a rock-solid pause window
    const schedule = [
      { pTravelStart: 0.000, pTravelEnd: 0.075, pPauseStart: 0.075, pPauseEnd: 0.140 }, // Problem pause
      { pTravelStart: 0.140, pTravelEnd: 0.220, pPauseStart: 0.220, pPauseEnd: 0.285 }, // User pause
      { pTravelStart: 0.285, pTravelEnd: 0.365, pPauseStart: 0.365, pPauseEnd: 0.430 }, // Idea pause
      { pTravelStart: 0.430, pTravelEnd: 0.510, pPauseStart: 0.510, pPauseEnd: 0.575 }, // Design pause
      { pTravelStart: 0.575, pTravelEnd: 0.655, pPauseStart: 0.655, pPauseEnd: 0.720 }, // AI pause
      { pTravelStart: 0.720, pTravelEnd: 0.800, pPauseStart: 0.800, pPauseEnd: 0.865 }, // Build pause
      { pTravelStart: 0.865, pTravelEnd: 0.940, pPauseStart: 0.940, pPauseEnd: 1.000 }, // Product pause
    ];

    let prevT = 0;
    return schedule.map((sch, i) => {
      const seg: JourneySegment = {
        ...sch,
        fromT: prevT,
        targetT: stops[i],
      };
      prevT = stops[i];
      return seg;
    });
  }, [spline]);

  const currentLookAt = useRef(new THREE.Vector3(0, 0.4, 0));
  const initialized = useRef(false);

  useFrame(() => {
    const rawP = THREE.MathUtils.clamp(scrollProgress.current, 0, 1);
    const tCamera = sampleJourneyProgress(rawP, segments);
    const tLookAt = Math.min(1.0, tCamera + 0.045);

    const targetPos = spline.getPointAt(tCamera);
    const targetLook = spline.getPointAt(tLookAt);

    targetPos.y += 0.35;

    camera.position.lerp(targetPos, 0.08);
    if (camera.position.distanceTo(targetPos) < 0.002) {
      camera.position.copy(targetPos);
    }

    if (!initialized.current) {
      currentLookAt.current.copy(targetLook);
      initialized.current = true;
    } else {
      currentLookAt.current.lerp(targetLook, 0.08);
      if (currentLookAt.current.distanceTo(targetLook) < 0.002) {
        currentLookAt.current.copy(targetLook);
      }
    }

    camera.lookAt(currentLookAt.current);
    onCameraUpdate(camera.position.z);
  });

  return null;
}

export const HowIThinkSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const scrollProgress = useRef(0);
  const [currentCameraZ, setCurrentCameraZ] = useState(10.0);
  const [isInView, setIsInView] = useState(true);

  // Viewport intersection observer to gate WebGL rendering when scrolled away
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '250px 0px', threshold: 0.001 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 48,
    damping: 24,
    restDelta: 0.0005,
  });

  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (latest) => {
      scrollProgress.current = latest;
    });

    return () => {
      unsubscribe();
    };
  }, [smoothProgress]);

  const { shouldReduceMotion } = useScrollAnimation();

  // Determine active node color to subtly tint the character's neural resonance
  const activeNode = useMemo(() => {
    if (currentCameraZ > -7.5) return WORLD_CONCEPTS[0]; // Problem
    if (currentCameraZ > -25.5) return WORLD_CONCEPTS[1]; // User
    if (currentCameraZ > -43.5) return WORLD_CONCEPTS[2]; // Idea
    if (currentCameraZ > -61.5) return WORLD_CONCEPTS[3]; // Design
    if (currentCameraZ > -79.5) return WORLD_CONCEPTS[4]; // AI
    if (currentCameraZ > -99.0) return WORLD_CONCEPTS[5]; // Engineering / Build
    return {
      id: 'product',
      color: '#FF4D1A',
      glowColor: 'rgba(255, 77, 26, 0.7)',
    };
  }, [currentCameraZ]);

  return (
    <section
      id="how-i-think"
      ref={containerRef}
      className="relative w-full h-[800vh] bg-[#0A0A0D] text-white select-none overflow-clip"
    >
      <span id="blog" className="sr-only pointer-events-none" aria-hidden="true" />
      {/* Sticky Fullscreen 3D Viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden">
        
        {/* Subtle Neural Visual Guide (Existing Hero Character) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden"
        >
          {/* Ambient Neural Resonance Aura reacting to active node */}
          <div
            style={{
              background: `radial-gradient(circle 520px at 50% 48%, ${activeNode.glowColor}, transparent 72%)`,
              opacity: 0.22,
              transition: 'background 1.4s ease, opacity 0.8s ease',
            }}
            className="absolute inset-0 -z-10 blur-3xl pointer-events-none"
          />

          {/* Exact Hero Character Video integrated as a calm, contemplative faint presence */}
          <div
            style={{
              maskImage: 'radial-gradient(circle 48% 50% at 50% 48%, black 30%, rgba(0,0,0,0.5) 65%, transparent 90%)',
              WebkitMaskImage: 'radial-gradient(circle 48% 50% at 50% 48%, black 30%, rgba(0,0,0,0.5) 65%, transparent 90%)',
            }}
            className="relative w-full h-full max-w-6xl flex items-center justify-center opacity-10 mix-blend-screen transition-opacity duration-700"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-full object-cover object-center filter grayscale contrast-125 brightness-85"
            >
              <source
                src="https://res.cloudinary.com/eltckiww/video/upload/v1785765451/kling_20260802_VIDEO_Cinematic__1324_0_ymj9qx.mp4"
                type="video/mp4"
              />
            </video>
            {/* Dark overlay to soften and subdue the video visibility further */}
            <div className="absolute inset-0 bg-black/60 pointer-events-none" />
            {/* Subtle Neural Network Energy Highlight */}
            <div
              style={{
                boxShadow: `inset 0 0 120px 25px ${activeNode.color}15`,
                transition: 'box-shadow 1.2s ease',
              }}
              className="absolute inset-0 pointer-events-none"
            />
          </div>
        </div>

        {/* Fullscreen 3D WebGL World */}
        <div className="absolute inset-0 z-[2]">
          <Canvas
            frameloop={isInView ? 'always' : 'never'}
            camera={{ position: [0, 0.8, 10.0], fov: 46 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 1.5]}
          >
            <ambientLight intensity={0.3} />
            <pointLight position={[0, 5, 0]} intensity={1.2} color="#7C3AED" />
            <pointLight position={[0, -5, -40]} intensity={0.9} color="#FF4D1A" />
            <pointLight position={[0, 0, DESTINATION_Z]} intensity={1.5} color="#FF7A00" />
            <FlightCamera
              scrollProgress={scrollProgress}
              onCameraUpdate={setCurrentCameraZ}
            />
            <SpaceEnvironmentParticles />
            <GlowingSynapticPath />
            {/* 3D Concept Landmarks */}
            {WORLD_CONCEPTS.map((c) => (
              <WorldConceptNode
                key={c.id}
                concept={c}
                cameraZ={currentCameraZ}
              />
            ))}
            {/* Destination PRODUCT */}
            <DestinationProductNode cameraZ={currentCameraZ} />
          </Canvas>
        </div>

        {/* Ambient Radial Vignette */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-[3] bg-radial from-transparent via-[#0A0A0D]/30 to-[#0A0A0D]/85"
        />

        {/* Section Header */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-10 pt-20 sm:pt-24 pointer-events-none">
          <motion.h2
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 14, filter: 'blur(4px)' }}
            whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
          >
            How I{' '}
            <span className="font-serif-italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D1A] via-[#FF8800] to-[#A855F7] drop-shadow-[0_0_24px_rgba(255,77,26,0.35)]">
              Think
            </span>
          </motion.h2>
        </div>

        {/* Bottom Spacer */}
        <div className="relative z-20 h-8 w-full pointer-events-none" />
      </div>
    </section>
  );
};
