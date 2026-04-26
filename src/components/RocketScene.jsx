import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, PerspectiveCamera } from '@react-three/drei';
import Rocket from './Rocket';
import Exhaust from './Exhaust';
import Stars from './Stars';

const RocketScene = ({ scrollProgress }) => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} />
        
        {/* Basic lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <directionalLight position={[-10, 0, -10]} intensity={0.5} color="#00f0ff" />
        <directionalLight position={[0, -10, 0]} intensity={2} color="#ff6b35" /> {/* Engine base light */}

        {/* Dynamic Fog based on scroll (thicker at launch, gone in space) */}
        <fog 
          attach="fog" 
          args={['#0d1b2a', 10, scrollProgress > 0.6 ? 200 : 30 + (scrollProgress * 50)]} 
        />

        <group position={[0, -1, 0]}>
          <Rocket scrollProgress={scrollProgress} />
          <Exhaust scrollProgress={scrollProgress} />
        </group>
        
        <Stars scrollProgress={scrollProgress} />
        
        <Environment preset="night" />
      </Canvas>
    </div>
  );
};

export default RocketScene;
