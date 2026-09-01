import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import TerminalScene from './TerminalScene';

function CameraRig({ scrollProgress, mouse }: { scrollProgress: React.MutableRefObject<number>; mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const { camera } = useThree();

  // Smooth camera path following the downward trajectory of the growing network
  const waypoints = [
    { progress: 0.0,  pos: new THREE.Vector3(0, 0.4, 4.8),      look: new THREE.Vector3(0, 0.4, 0) },
    { progress: 0.20, pos: new THREE.Vector3(0.3, 0.2, 3.8),    look: new THREE.Vector3(0.1, 0.2, -1.5) },
    { progress: 0.45, pos: new THREE.Vector3(-0.2, -0.1, 2.2),  look: new THREE.Vector3(-0.1, 0, -3.5) },
    { progress: 0.70, pos: new THREE.Vector3(0.2, -0.2, 0.2),   look: new THREE.Vector3(0.1, -0.1, -6.0) },
    { progress: 1.0,  pos: new THREE.Vector3(0, -0.2, -2.2),    look: new THREE.Vector3(0, 0, -9.0) },
  ];

  useFrame(() => {
    const p = scrollProgress.current;
    let a = waypoints[0];
    let b = waypoints[waypoints.length - 1];

    for (let i = 0; i < waypoints.length - 1; i++) {
      if (p >= waypoints[i].progress && p <= waypoints[i + 1].progress) {
        a = waypoints[i];
        b = waypoints[i + 1];
        break;
      }
    }

    const range = b.progress - a.progress || 1;
    const t = THREE.MathUtils.clamp((p - a.progress) / range, 0, 1);

    const targetPos = a.pos.clone().lerp(b.pos, t);
    const targetLook = a.look.clone().lerp(b.look, t);

    // Very subtle responsive mouse parallax
    targetLook.x += mouse.current.x * 0.08;
    targetLook.y += mouse.current.y * 0.06;

    camera.position.lerp(targetPos, 0.04);
    camera.lookAt(camera.position.clone().add(targetLook.clone().sub(camera.position)).lerp(targetLook, 0.05));
  });

  return null;
}

export default function Scene3D() {
  const scrollProgress = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    const handleScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
      scrollProgress.current = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    };

    const handleMouse = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouse);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  if (!ready) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0.4, 4.8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.25} />
        <pointLight position={[5, 5, 5]} intensity={0.45} color="#7C3AED" />
        <pointLight position={[-5, -3, -5]} intensity={0.35} color="#FF4D1A" />
        <CameraRig scrollProgress={scrollProgress} mouse={mouse} />
        <TerminalScene />
      </Canvas>
    </div>
  );
}


