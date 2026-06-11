import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Rotating Globe Component
const GlobeModel = () => {
  const globeRef = useRef();
  const wireRef = useRef();
  const wireSlowRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    if (globeRef.current) {
      globeRef.current.rotation.y = elapsedTime * 0.08;
      globeRef.current.rotation.x = elapsedTime * 0.03;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = -elapsedTime * 0.12;
    }
    if (wireSlowRef.current) {
      wireSlowRef.current.rotation.x = -elapsedTime * 0.05;
      wireSlowRef.current.rotation.z = elapsedTime * 0.04;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.y = elapsedTime * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -elapsedTime * 0.2;
      ring2Ref.current.rotation.x = elapsedTime * 0.1;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = elapsedTime * 0.08;
      ring3Ref.current.rotation.z = -elapsedTime * 0.05;
    }
  });

  return (
    <group ref={globeRef}>
      {/* Central Solid core with standard material for light reactions */}
      <mesh>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial 
          color="#090b16" 
          roughness={0.4} 
          metalness={0.9} 
          emissive="#1e1b4b"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Wireframe outer sphere */}
      <mesh ref={wireRef}>
        <sphereGeometry args={[2.52, 36, 36]} />
        <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.4} />
      </mesh>

      {/* Secondary wireframe for grid depth */}
      <mesh ref={wireSlowRef}>
        <sphereGeometry args={[2.55, 20, 20]} />
        <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.2} />
      </mesh>

      {/* Connection points / nodes */}
      <points>
        <sphereGeometry args={[2.53, 24, 24]} />
        <pointsMaterial color="#60a5fa" size={0.07} sizeAttenuation={true} />
      </points>

      {/* Glow Halo Rings with independent rotation */}
      <group ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
        <mesh>
          <torusGeometry args={[2.8, 0.015, 8, 64]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.3} />
        </mesh>
      </group>
      <group ref={ring2Ref} rotation={[-Math.PI / 3, Math.PI / 4, 0]}>
        <mesh>
          <torusGeometry args={[3.0, 0.01, 8, 64]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.2} />
        </mesh>
      </group>
      <group ref={ring3Ref} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <torusGeometry args={[3.2, 0.008, 8, 64]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.15} />
        </mesh>
      </group>
    </group>
  );
};

// Orbital Particle Ring
const OrbitParticles = () => {
  const pointsRef = useRef();
  const count = 500;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 3.6 + Math.random() * 1.2; // orbit radius range
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.4; // vertical scatter
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial color="#60a5fa" size={0.06} sizeAttenuation={true} transparent opacity={0.8} />
    </points>
  );
};

// Spherical Floating Cosmic Dots
const FloatingDots = () => {
  const dotsRef = useRef();
  const count = 300;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 3.2 + Math.random() * 3.0; // sphere shell radius
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (dotsRef.current) {
      dotsRef.current.rotation.y = -clock.getElapsedTime() * 0.04;
      dotsRef.current.rotation.x = clock.getElapsedTime() * 0.015;
    }
  });

  return (
    <points ref={dotsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial color="#c084fc" size={0.05} sizeAttenuation={true} transparent opacity={0.6} />
    </points>
  );
};

// Canvas wrapper for Globe
const ThreeGlobe = () => {
  return (
    <div className="w-full h-full flex items-center justify-center relative select-none">
      <Canvas
        camera={{ position: [0, 0, 7.0], fov: 45 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={2.2} color="#60a5fa" />
        <pointLight position={[-5, -5, -5]} intensity={1.8} color="#8b5cf6" />
        
        {/* Floating background particles */}
        <Stars radius={100} depth={50} count={600} factor={4} saturation={0} fade speed={1.5} />
        
        <GlobeModel />
        <OrbitParticles />
        <FloatingDots />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 2 + 0.3}
          minPolarAngle={Math.PI / 2 - 0.3}
        />
      </Canvas>
      
      {/* Glowing background behind canvas */}
      <div className="absolute w-[80%] h-[80%] rounded-full bg-brand-primary/15 blur-[120px] -z-10 translate-y-4 scale-75 animate-pulse" style={{ animationDuration: '4s' }} />
    </div>
  );
};

export default ThreeGlobe;
