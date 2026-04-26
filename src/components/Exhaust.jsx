import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Exhaust = ({ scrollProgress }) => {
  const particlesRef = useRef();
  
  const particleCount = 2000;
  
  const [positions, colors, scales, speeds] = useMemo(() => {
    const p = new Float32Array(particleCount * 3);
    const c = new Float32Array(particleCount * 3);
    const s = new Float32Array(particleCount);
    const sp = new Float32Array(particleCount);
    
    const colorWhite = new THREE.Color(0xffffff);
    const colorOrange = new THREE.Color(0xff6b35);
    const colorBlue = new THREE.Color(0x00f0ff);
    
    for (let i = 0; i < particleCount; i++) {
      // Start clustered at origin
      p[i * 3] = (Math.random() - 0.5) * 0.5;
      p[i * 3 + 1] = Math.random() * -2; // Y position (downwards)
      p[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      
      // Color interpolation
      const mixRatio = Math.random();
      let mixedColor;
      if (Math.random() > 0.8) {
        mixedColor = colorBlue; // Core heat
      } else {
        mixedColor = colorWhite.clone().lerp(colorOrange, mixRatio);
      }
      
      c[i * 3] = mixedColor.r;
      c[i * 3 + 1] = mixedColor.g;
      c[i * 3 + 2] = mixedColor.b;
      
      s[i] = Math.random() * 2;
      sp[i] = 2 + Math.random() * 5; // Speed
    }
    
    return [p, c, s, sp];
  }, [particleCount]);

  useFrame((state, delta) => {
    if (!particlesRef.current) return;
    
    // Base flame even at 0 progress
    const activeProgress = Math.max(0.1, scrollProgress);
    const positions = particlesRef.current.geometry.attributes.position.array;
    
    for (let i = 0; i < particleCount; i++) {
      let y = positions[i * 3 + 1];
      
      // Move particle down
      y -= speeds[i] * delta * (1 + activeProgress * 5); // Speed up based on scroll
      
      // Reset if it goes too far down, expanding spread at the bottom
      if (y < -15 * activeProgress - 2) {
        y = 0;
        positions[i * 3] = (Math.random() - 0.5) * 1.5; // Wider spawn X
        positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5; // Wider spawn Z
      } else {
        // Expand outwards as it goes down
        positions[i * 3] *= 1.01 + (activeProgress * 0.05);
        positions[i * 3 + 2] *= 1.01 + (activeProgress * 0.05);
      }
      
      positions[i * 3 + 1] = y;
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Scale particles overall based on scroll progress
    particlesRef.current.material.size = (0.5 + activeProgress * 1.5) * 1.5; // base size
    // Opacity based on scroll progress (0 at top, higher as you scroll)
    particlesRef.current.material.opacity = Math.min(0.8, 0.2 + activeProgress * 0.8);
  });

  return (
    <points ref={particlesRef} position={[0, -2.5, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={scales}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.5}
        vertexColors
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default Exhaust;
