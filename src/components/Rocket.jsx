import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Rocket = ({ scrollProgress }) => {
  const group = useRef();

  // Procedural Rocket Materials
  const materials = useMemo(() => ({
    hull: new THREE.MeshStandardMaterial({ 
      color: 0xffffff, 
      roughness: 0.2, 
      metalness: 0.8 
    }),
    nose: new THREE.MeshStandardMaterial({ 
      color: 0x111111, 
      roughness: 0.5, 
      metalness: 0.5 
    }),
    trim: new THREE.MeshStandardMaterial({ 
      color: 0x00f0ff, 
      roughness: 0.1, 
      metalness: 0.8,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.5
    }),
    engine: new THREE.MeshStandardMaterial({ 
      color: 0x333333, 
      roughness: 0.8, 
      metalness: 0.9 
    }),
    window: new THREE.MeshStandardMaterial({
      color: 0x0a0a1a,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0x00d0ff,
      emissiveIntensity: 0.2
    })
  }), []);

  useFrame((state) => {
    if (!group.current) return;
    
    // Idle float animation
    const time = state.clock.getElapsedTime();
    const floatOffset = Math.sin(time * 2) * 0.1;
    
    // Vibration based on scroll progress (simulate launch)
    let vibrateX = 0;
    let vibrateZ = 0;
    
    if (scrollProgress > 0.05 && scrollProgress < 0.9) {
      // Intensity peaks in middle of scroll
      const intensity = Math.sin(scrollProgress * Math.PI) * 0.05;
      vibrateX = (Math.random() - 0.5) * intensity;
      vibrateZ = (Math.random() - 0.5) * intensity;
    }

    group.current.position.y = floatOffset;
    group.current.position.x = vibrateX;
    group.current.position.z = vibrateZ;

    // Slight tilt during "flight"
    group.current.rotation.z = Math.sin(time) * 0.02 * scrollProgress;
    group.current.rotation.x = Math.cos(time * 0.8) * 0.02 * scrollProgress;
  });

  return (
    <group ref={group} scale={[0.5, 0.5, 0.5]} position={[0, -1, 0]}>
      {/* Main Hull */}
      <mesh material={materials.hull} position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1, 6, 32]} />
      </mesh>

      {/* Nose Cone */}
      <mesh material={materials.nose} position={[0, 4, 0]}>
        <coneGeometry args={[1, 2, 32]} />
      </mesh>

      {/* Window */}
      <mesh material={materials.window} position={[0, 1.5, 0.95]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
      </mesh>
      
      {/* Window Border */}
      <mesh material={materials.hull} position={[0, 1.5, 0.9]}>
        <torusGeometry args={[0.45, 0.05, 16, 32]} />
      </mesh>

      {/* Fins */}
      {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((rotation, i) => (
        <group key={i} rotation={[0, rotation, 0]}>
          <mesh material={materials.trim} position={[1.4, -2, 0]}>
            <boxGeometry args={[1, 2, 0.1]} />
          </mesh>
          <mesh material={materials.nose} position={[1.4, -1, 0]}>
             <boxGeometry args={[1, 0.2, 0.15]} />
          </mesh>
        </group>
      ))}

      {/* Engine Nozzle */}
      <mesh material={materials.engine} position={[0, -3.5, 0]}>
        <cylinderGeometry args={[0.8, 1.2, 1, 32]} />
      </mesh>
      
      {/* Engine Core Inner Glow */}
      <mesh position={[0, -4.1, 0]}>
        <cylinderGeometry args={[0.9, 1, 0.2, 32]} />
        <meshBasicMaterial color={0xffffff} />
      </mesh>
    </group>
  );
};

export default Rocket;
