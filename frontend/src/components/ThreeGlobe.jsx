import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Rotating Globe Component
const GlobeModel = () => {
  const globeRef = useRef();
  const wireRef = useRef();

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    if (globeRef.current) {
      globeRef.current.rotation.y = elapsedTime * 0.1;
      globeRef.current.rotation.x = elapsedTime * 0.05;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = -elapsedTime * 0.15;
    }
  });

  return (
    <group ref={globeRef}>
      {/* Central Solid core */}
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#0e0f17" transparent opacity={0.8} />
      </mesh>

      {/* Wireframe outer sphere */}
      <mesh ref={wireRef}>
        <sphereGeometry args={[2.02, 24, 24]} />
        <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Connection points / nodes */}
      <points>
        <sphereGeometry args={[2.03, 16, 16]} />
        <pointsMaterial color="#3b82f6" size={0.06} sizeAttenuation={true} />
      </points>

      {/* Orbit paths around the globe */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.3, 0.01, 8, 64]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.15} />
      </mesh>
      <mesh rotation={[-Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[2.5, 0.008, 8, 64]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} />
      </mesh>
    </group>
  );
};

// Canvas wrapper for Globe
const ThreeGlobe = () => {
  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[500px] flex items-center justify-center relative select-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={1.5} />
        
        {/* Floating background particles */}
        <Stars radius={100} depth={50} count={300} factor={4} saturation={0} fade speed={1.5} />
        
        <GlobeModel />
        
        {/* Allows manual rotation of globe */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 2 + 0.3}
          minPolarAngle={Math.PI / 2 - 0.3}
        />
      </Canvas>
      
      {/* Glowing background behind canvas */}
      <div className="absolute inset-0 bg-radial-glow -z-10 translate-y-10 scale-75" />
    </div>
  );
};

export default ThreeGlobe;
