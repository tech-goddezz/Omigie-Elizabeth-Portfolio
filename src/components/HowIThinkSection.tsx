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
    pos: [-2.2, 0.4, -6.0],
    cameraStopZ: -1.0,
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
    pos: [2.2, -0.3, -24.0],
    cameraStopZ: -19.0,
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
    pos: [-2.0, -0.2, -42.0],
    cameraStopZ: -37.0,
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
    pos: [2.0, 0.5, -60.0],
    cameraStopZ: -55.0,
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
    pos: [-2.1, 0.3, -78.0],
    cameraStopZ: -73.0,
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
    pos: [2.1, -0.2, -96.0],
    cameraStopZ: -91.0,
  },
];

const DESTINATION_Z = -118.0;

// Continuous 3D Spline Path that flows from the entrance through every concept node to PRODUCT
const SPLINE_WAYPOINTS = [
  new THREE.Vector3(0, 0.5, 10.0),
  new THREE.Vector3(-1.2, 0.4, 0.0),
  new THREE.Vector3(-2.2, 0.4, -6.0), // PROBLEM
  new THREE.Vector3(-0.5, 0.1, -15.0),
  new THREE.Vector3(2.2, -0.3, -24.0), // USER
  new THREE.Vector3(0.5, -0.2, -33.0),
  new THREE.Vector3(-2.0, -0.2, -42.0), // IDEA
  new THREE.Vector3(-0.2, 0.2, -51.0),
  new THREE.Vector3(2.0, 0.5, -60.0), // DESIGN
  new THREE.Vector3(0.3, 0.4, -69.0),
  new THREE.Vector3(-2.1, 0.3, -78.0), // AI
  new THREE.Vector3(-0.4, -0.1, -87.0),
  new THREE.Vector3(2.1, -0.2, -96.0), // ENGINEERING
  new THREE.Vector3(0.6, 0.0, -106.0),
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

  useFrame((_, delta) => {
    if (!active || !pointsRef.current) return;

    signalTrajectories.forEach((traj, idx) => {
      traj.progress = (traj.progress + delta * traj.speed) % 1.0;
      const currentPos = new THREE.Vector3().lerpVectors(traj.start, traj.end, traj.progress);
      signalPosBuffer[idx * 3 + 0] = currentPos.x;
      signalPosBuffer[idx * 3 + 1] = currentPos.y;
      signalPosBuffer[idx * 3 + 2] = currentPos.z;
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

  // STRICT LEGIBILITY LOGIC:
  const isReadable = distFromCamera <= 12 && distFromCamera >= -2.5;
  const textOpacity = isReadable
    ? distFromCamera > 7
      ? (12 - distFromCamera) / 5
      : distFromCamera < -1
      ? (distFromCamera + 2.5) / 1.5
      : 1
    : 0;

  const beaconOpacity = distFromCamera > 0 ? Math.min(0.8, 15 / Math.max(1, distFromCamera)) : 0;
  const isAI = concept.id === 'ai';

  // AI Phased reveal states based on approach progress
  const aiFirstStatementVisible = isAI && distFromCamera <= 12;
  const aiSecondStatementVisible = isAI && distFromCamera <= 7.5;

  return (
    <group position={concept.pos}>
      {/* Dense Active Neural Cluster specifically for AI */}
      {isAI && <AIDenseNeuralCluster active={distFromCamera <= 18 && distFromCamera >= -8} />}

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

      {/* HTML Spatial Typography Billboard - Static clean text rendering without moving/scaling shifts */}
      {isReadable && (
        <Html
          position={[0, 0, 0]}
          center
          distanceFactor={7}
          zIndexRange={[100, 0]}
        >
          <div
            style={{
              opacity: textOpacity,
            }}
            className="pointer-events-none select-none transition-opacity duration-150 w-[90vw] max-w-[90vw] sm:max-w-[360px] md:max-w-[420px] px-4 text-center mx-auto"
          >
            {/* Ambient Backlight Halo */}
            <div
              aria-hidden="true"
              style={{
                backgroundColor: concept.glowColor,
              }}
              className="absolute w-32 h-32 rounded-full blur-3xl -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40"
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

            {/* Minimalist Icon Badge */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <div
                style={{
                  borderColor: `${concept.color}50`,
                  boxShadow: `0 0 25px ${concept.glowColor}`,
                }}
                className="w-9 h-9 rounded-xl bg-[#0F0E14]/90 border backdrop-blur-md flex items-center justify-center"
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
            <p className="mt-2 text-[11.5px] sm:text-xs text-zinc-300 leading-relaxed drop-shadow text-center max-w-[280px] sm:max-w-[300px] mx-auto [text-wrap:balance]">
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
      new THREE.Vector3(-2.2, 0.4, 112.0),
      new THREE.Vector3(2.2, -0.3, 94.0),
      new THREE.Vector3(-2.0, -0.2, 76.0),
      new THREE.Vector3(2.0, 0.5, 58.0),
      new THREE.Vector3(-2.1, 0.3, 40.0),
      new THREE.Vector3(2.1, -0.2, 22.0),
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
        <Html position={[0, 0, 0]} center distanceFactor={7} zIndexRange={[100, 0]}>
          <div
            style={{
              opacity,
            }}
            className="pointer-events-none select-none text-center w-[320px] sm:w-[480px] md:w-[600px] px-4 transition-opacity duration-200"
          >
            {/* Contrast-enhancing Circular Scrim Backdrop */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] md:w-[500px] md:h-[500px] rounded-full bg-radial from-[#08080C]/88 via-[#08080C]/75 to-[#08080C]/0 backdrop-blur-md -z-10 pointer-events-none shadow-[0_0_60px_rgba(0,0,0,0.85)]"
            />

            {/* Ambient Glow */}
            <div
              aria-hidden="true"
              className="absolute -inset-20 rounded-full bg-radial from-[#FF4D1A]/15 via-[#7C3AED]/10 to-transparent blur-3xl -z-20 pointer-events-none"
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
            <p className="mt-4 text-xs sm:text-sm md:text-base text-zinc-200 font-medium max-w-md mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
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

// Continuous 3D Flight Camera Rig
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

  useFrame(() => {
    const p = THREE.MathUtils.clamp(scrollProgress.current, 0, 1);
    const tCamera = p * 0.96;
    const tLookAt = Math.min(1.0, tCamera + 0.045);

    const targetPos = spline.getPointAt(tCamera);
    const targetLook = spline.getPointAt(tLookAt);

    targetPos.y += 0.35;

    camera.position.lerp(targetPos, 0.09);
    camera.lookAt(targetLook);

    onCameraUpdate(camera.position.z);
  });

  return null;
}

export const HowIThinkSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const scrollProgress = useRef(0);
  const [currentCameraZ, setCurrentCameraZ] = useState(10.0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 18,
    restDelta: 0.001,
  });

  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (latest) => {
      scrollProgress.current = latest;
    });

    return () => {
      unsubscribe();
    };
  }, [smoothProgress]);

  const { getFadeUp, shouldReduceMotion } = useScrollAnimation();

  // Determine active node color to subtly tint the character's neural resonance
  const activeNode = useMemo(() => {
    if (currentCameraZ > -15) return WORLD_CONCEPTS[0]; // Problem
    if (currentCameraZ > -33) return WORLD_CONCEPTS[1]; // User
    if (currentCameraZ > -51) return WORLD_CONCEPTS[2]; // Idea
    if (currentCameraZ > -69) return WORLD_CONCEPTS[3]; // Design
    if (currentCameraZ > -87) return WORLD_CONCEPTS[4]; // AI
    if (currentCameraZ > -107) return WORLD_CONCEPTS[5]; // Engineering
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
      className="relative w-full h-[600vh] bg-[#0A0A0D] text-white select-none overflow-clip"
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
