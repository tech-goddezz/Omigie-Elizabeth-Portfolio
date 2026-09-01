import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { Sparkles, Network, Compass } from 'lucide-react';
import { useScrollAnimation } from '../utils/motion';

// System Node Definition
interface SystemNode {
  id: string;
  system: 'how-i-think' | 'capabilities' | 'projects' | 'process' | 'ai';
  initialPos: THREE.Vector3;
  color: string;
  label: string;
}

// 3D Scene Inside Canvas for Final Convergence
function ConvergenceScene({
  scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>;
}) {
  const { nodes, initialLines } = useMemo(() => {
    const rawNodes: SystemNode[] = [
      // 1. HOW I THINK Nodes (Top Left Cluster)
      { id: 'hit-1', system: 'how-i-think', initialPos: new THREE.Vector3(-4.5, 2.5, -2), color: '#FF4D1A', label: 'PROBLEM' },
      { id: 'hit-2', system: 'how-i-think', initialPos: new THREE.Vector3(-3.8, 3.2, -1), color: '#A855F7', label: 'USER' },
      { id: 'hit-3', system: 'how-i-think', initialPos: new THREE.Vector3(-3.0, 2.0, -3), color: '#FF7A00', label: 'IDEA' },
      { id: 'hit-4', system: 'how-i-think', initialPos: new THREE.Vector3(-2.2, 3.4, -2), color: '#C084FC', label: 'DESIGN' },

      // 2. CAPABILITIES Nodes (Bottom Left Cluster)
      { id: 'cap-1', system: 'capabilities', initialPos: new THREE.Vector3(-4.2, -2.5, -1), color: '#7C3AED', label: 'UI/UX' },
      { id: 'cap-2', system: 'capabilities', initialPos: new THREE.Vector3(-3.2, -3.2, -3), color: '#FF4D1A', label: 'FRONTEND' },
      { id: 'cap-3', system: 'capabilities', initialPos: new THREE.Vector3(-2.4, -2.0, -2), color: '#FF7A00', label: 'MOBILE' },

      // 3. PROJECTS Nodes (Top Right Cluster)
      { id: 'prj-1', system: 'projects', initialPos: new THREE.Vector3(4.2, 2.8, -2), color: '#FF4D1A', label: 'P01 SAAS' },
      { id: 'prj-2', system: 'projects', initialPos: new THREE.Vector3(3.4, 3.6, -1), color: '#FF7A00', label: 'P02 COMMERCE' },
      { id: 'prj-3', system: 'projects', initialPos: new THREE.Vector3(2.5, 2.2, -3), color: '#A855F7', label: 'P03 BRAND' },
      { id: 'prj-4', system: 'projects', initialPos: new THREE.Vector3(4.8, 1.8, -2), color: '#FF4D1A', label: 'P04 AI PLATFORM' },

      // 4. PROCESS Nodes (Bottom Right Cluster)
      { id: 'prc-1', system: 'process', initialPos: new THREE.Vector3(4.0, -2.2, -1), color: '#FF7A00', label: 'DISCOVER' },
      { id: 'prc-2', system: 'process', initialPos: new THREE.Vector3(3.2, -3.4, -3), color: '#FF4D1A', label: 'BUILD' },
      { id: 'prc-3', system: 'process', initialPos: new THREE.Vector3(2.2, -2.4, -2), color: '#7C3AED', label: 'SHIP' },

      // 5. AI Synaptic Core (Central Cluster)
      { id: 'ai-core-1', system: 'ai', initialPos: new THREE.Vector3(0.0, 1.2, -1), color: '#7C3AED', label: 'INTELLIGENCE' },
      { id: 'ai-core-2', system: 'ai', initialPos: new THREE.Vector3(-0.8, -0.6, -1.5), color: '#FF4D1A', label: 'AGENTIC' },
      { id: 'ai-core-3', system: 'ai', initialPos: new THREE.Vector3(0.8, -0.6, -1.5), color: '#A855F7', label: 'PIPELINES' },
    ];

    // Inter-system connections (sparse, coherent filaments)
    const connections: [number, number][] = [
      // HIT -> AI Core
      [2, 14], [3, 14],
      // Capabilities -> Process
      [4, 11], [5, 12],
      // Projects -> Capabilities
      [7, 5], [10, 14],
      // Process -> HIT
      [11, 0], [13, 16],
      // AI Core internal
      [14, 15], [15, 16], [16, 14],
      // Cross-diagonal stabilization filaments
      [0, 4], [7, 11], [3, 9],
    ];

    return {
      nodes: rawNodes,
      initialLines: connections,
    };
  }, []);

  const nodePositions = useMemo(() => new Float32Array(nodes.length * 3), [nodes.length]);
  const linePositions = useMemo(() => new Float32Array(initialLines.length * 6), [initialLines.length]);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const coreOrbRef = useRef<THREE.Mesh>(null);
  const coreGlowRef = useRef<THREE.Mesh>(null);

  useFrame(({ camera }) => {
    const p = Math.max(0, Math.min(1, scrollProgress.current));

    // 1. Slow camera pullback: Starts near z=10, pulls back to z=16, then gently focuses into center
    const targetCameraZ = p < 0.5 ? 10 + p * 12 : 16 - (p - 0.5) * 6;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCameraZ, 0.08);

    // 2. Convergence factor:
    // 0.0 -> 0.35: Spread out
    // 0.35 -> 0.85: Smooth contraction towards origin [0, 0, 0]
    // 0.85 -> 1.0: Fully converged into the singular Litz mark center
    const convergenceFactor = p < 0.3 ? 0 : Math.min(1, (p - 0.3) / 0.55);
    const easeConvergence = convergenceFactor * convergenceFactor * (3 - 2 * convergenceFactor); // smoothstep
    const invEase = 1 - easeConvergence;

    const time = performance.now() * 0.0015;

    // Update node positions directly into typed buffer without vector object allocations
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const idle = Math.sin(time + i) * 0.08 * invEase;
      const x = node.initialPos.x * invEase;
      const y = node.initialPos.y * invEase + idle;
      const z = node.initialPos.z * invEase;
      nodePositions[i * 3 + 0] = x;
      nodePositions[i * 3 + 1] = y;
      nodePositions[i * 3 + 2] = z;
    }

    // Update line positions directly into typed buffer without object creation
    for (let idx = 0; idx < initialLines.length; idx++) {
      const [a, b] = initialLines[idx];
      const a3 = a * 3;
      const b3 = b * 3;
      const l6 = idx * 6;

      linePositions[l6 + 0] = nodePositions[a3 + 0];
      linePositions[l6 + 1] = nodePositions[a3 + 1];
      linePositions[l6 + 2] = nodePositions[a3 + 2];
      linePositions[l6 + 3] = nodePositions[b3 + 0];
      linePositions[l6 + 4] = nodePositions[b3 + 1];
      linePositions[l6 + 5] = nodePositions[b3 + 2];
    }

    if (pointsRef.current) {
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      if (pointsRef.current.material) {
        (pointsRef.current.material as THREE.PointsMaterial).opacity = 0.85 * (1 - easeConvergence * 0.45);
      }
    }

    if (linesRef.current) {
      linesRef.current.geometry.attributes.position.needsUpdate = true;
      if (linesRef.current.material) {
        (linesRef.current.material as THREE.LineBasicMaterial).opacity = 0.35 * (1 - easeConvergence * 0.7);
      }
    }

    // Central Core Orb Illumination at convergence
    if (coreOrbRef.current) {
      const scale = THREE.MathUtils.lerp(0.01, 0.45, easeConvergence);
      coreOrbRef.current.scale.set(scale, scale, scale);
    }
    if (coreGlowRef.current && coreGlowRef.current.material) {
      (coreGlowRef.current.material as THREE.MeshBasicMaterial).opacity = easeConvergence * 0.4;
      const glowScale = 0.5 + easeConvergence * 1.5;
      coreGlowRef.current.scale.set(glowScale, glowScale, glowScale);
    }
  });

  return (
    <group>
      {/* Network Connecting Filaments */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#A855F7"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* System Node Beacons */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#FF4D1A"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Converged Central Singularity Orb */}
      <mesh ref={coreOrbRef} scale={[0.01, 0.01, 0.01]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>

      {/* Ambient Core Aura Glow */}
      <mesh ref={coreGlowRef} scale={[0.01, 0.01, 0.01]}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshBasicMaterial
          color="#FF4D1A"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export const ConvergenceSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollProgressRef = useRef<number>(0);
  const isInView = useInView(containerRef, { margin: '-5% 0px -5% 0px', once: false });
  const { shouldReduceMotion } = useScrollAnimation();

  // Scroll tracking across the convergence corridor
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  scrollYProgress.on('change', (v) => {
    scrollProgressRef.current = v;
  });

  // Smooth transforms for UI stages
  const stage1Opacity = useTransform(scrollYProgress, [0.0, 0.15, 0.4, 0.55], [0.1, 1, 1, 0]);
  const stage2Opacity = useTransform(scrollYProgress, [0.45, 0.6, 0.75, 0.85], [0, 1, 1, 0]);
  const finalMarkOpacity = useTransform(scrollYProgress, [0.78, 0.88, 1.0], [0, 1, 1]);
  const finalMarkScale = useTransform(scrollYProgress, [0.78, 0.92, 1.0], [0.92, 1.0, 1.02]);

  return (
    <section
      ref={sectionRef}
      id="convergence"
      className="relative w-full text-white select-none overflow-clip"
    >
      {/* Multi-Screen Scroll Track (Native, Responsive) */}
      <div
        ref={containerRef}
        className="relative w-full h-[220vh] sm:h-[260vh] md:h-[300vh]"
      >
        {/* Sticky Fullscreen 3D Convergence Viewport */}
        <div className="sticky top-0 h-[100svh] min-h-[100svh] w-full flex flex-col justify-between overflow-hidden">
          
          {/* Subtle Ambient Radial Glow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none z-0 bg-radial from-[#FF4D1A]/10 via-[#7C3AED]/05 to-[#0A0A0D]/95"
          />

          {/* Fullscreen 3D WebGL Canvas */}
          <div aria-hidden="true" className="absolute inset-0 z-10">
            <Canvas
              frameloop={isInView ? 'always' : 'never'}
              camera={{ position: [0, 0, 10], fov: 46 }}
              gl={{ antialias: true, alpha: true }}
              dpr={[1, 1.5]}
            >
              <ambientLight intensity={0.4} />
              <pointLight position={[0, 0, 5]} intensity={1.5} color="#FF7A00" />
              <pointLight position={[0, 0, -5]} intensity={1.2} color="#A855F7" />
              <ConvergenceScene scrollProgress={scrollProgressRef} />
            </Canvas>
          </div>

          {/* Screen-reader accessible summary */}
          <div className="sr-only">
            <h3>Synthesis of 5 Disciplines</h3>
            <p>All disciplines (How I Think, Capabilities, Projects, Process, and AI Core) unite into a single product-engineering vision: Design, code, and intelligence united in a single craft under Litz.</p>
          </div>

          {/* Top Header Identifier */}
          <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 pt-16 sm:pt-20 pointer-events-none flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#FF4D1A] backdrop-blur-md">
              <Network className="w-3.5 h-3.5 text-[#FF4D1A]" />
              <span>NEURAL SYNTHESIS</span>
            </div>
            <div className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase hidden sm:inline">
              5 SYSTEMS &bull; ONE DISCIPLINE
            </div>
          </div>

          {/* Center Dynamic Stage Overlays */}
          <div className="relative z-20 max-w-4xl mx-auto w-full px-4 sm:px-6 text-center pointer-events-none flex-1 flex flex-col items-center justify-center">
            
            {/* Stage 1: The Widespread 5-System Network Revealed */}
            <motion.div
              style={{
                opacity: shouldReduceMotion ? 1 : stage1Opacity,
                display: shouldReduceMotion ? 'none' : undefined,
              }}
              className="space-y-3 max-w-xl mx-auto"
            >
              <div className="text-xs sm:text-sm font-mono font-bold tracking-widest text-[#FF7A00] uppercase flex items-center justify-center gap-2">
                <Compass className="w-4 h-4 text-[#FF7A00]" />
                <span>OBSERVE THE ARCHITECTURE</span>
              </div>
              <h3 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                All systems belong to one product-engineering mind.
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-normal max-w-md mx-auto">
                How I Think, Capabilities, Projects, Pipeline, and AI Intelligence unified in one cohesive space.
              </p>
            </motion.div>

            {/* Stage 2: Coherence & Contraction */}
            <motion.div
              style={{
                opacity: shouldReduceMotion ? 0 : stage2Opacity,
                display: shouldReduceMotion ? 'none' : undefined,
              }}
              className="space-y-3 max-w-xl mx-auto absolute inset-x-4 top-1/2 -translate-y-1/2"
            >
              <div className="text-xs sm:text-sm font-mono font-bold tracking-widest text-[#A855F7] uppercase flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-[#A855F7]" />
                <span>HARMONIC CONVERGENCE</span>
              </div>
              <h3 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-300 leading-none">
                5 SYSTEMS. ONE VISION.
              </h3>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {['HOW I THINK', 'CAPABILITIES', 'PROJECTS', 'PROCESS', 'AI CORE'].map((sys, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-zinc-300"
                  >
                    {sys}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Stage 3: Final Compression into the Litz. Mark (Complex System – One Identity) */}
            <motion.div
              style={{
                opacity: shouldReduceMotion ? 1 : finalMarkOpacity,
                scale: shouldReduceMotion ? 1 : finalMarkScale,
              }}
              className="space-y-4 max-w-xl mx-auto absolute inset-x-4 top-1/2 -translate-y-1/2"
            >
              {/* Subtle Atmospheric Halo */}
              <div
                aria-hidden="true"
                className="absolute -inset-12 rounded-full bg-radial from-[#FF4D1A]/25 via-[#7C3AED]/20 to-transparent blur-3xl -z-10 animate-pulse"
              />
              <div className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#FF7A00] uppercase">
                COMPLEX SYSTEM &rarr; ONE IDENTITY
              </div>

              {/* Litz. Signature Wordmark */}
              <div className="space-y-1">
                <span className="font-signature text-6xl sm:text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF4D1A] to-[#A855F7] block drop-shadow-2xl select-none">
                  Litz.
                </span>
                <p className="text-xs sm:text-sm text-zinc-300 font-normal max-w-sm mx-auto leading-relaxed">
                  Design, code, and intelligence united in a single craft.
                </p>
              </div>

              {/* Seamless Bridge Prompt to Contact */}
              <div className="pt-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF4D1A] flex items-center justify-center gap-1.5 animate-pulse">
                  <span>READY TO INITIATE</span>
                  <span>&darr;</span>
                </span>
              </div>
            </motion.div>

          </div>

          {/* Bottom Progress Tracker */}
          <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 pb-6 sm:pb-8 pointer-events-none flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>SYNTHESIS COMPLETE</span>
            <span className="uppercase tracking-widest text-zinc-400">SCROLL TO CONNECT</span>
          </div>
        </div>
      </div>
    </section>
  );
};
