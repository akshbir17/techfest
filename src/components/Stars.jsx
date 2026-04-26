import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars as DreiStars } from '@react-three/drei';

const Stars = ({ scrollProgress }) => {
  const starsRef = useRef();

  useFrame((state) => {
    if (!starsRef.current) return;
    
    // Slowly rotate the stars
    starsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    starsRef.current.rotation.x = state.clock.getElapsedTime() * 0.01;
  });

  // Fade in stars based on scroll progress (visible in stratosphere/space)
  // fade starts around 0.4 progress, full at 0.6
  const opacity = Math.max(0, Math.min(1, (scrollProgress - 0.4) * 5));

  return (
    <group ref={starsRef}>
      {opacity > 0.01 && (
         <DreiStars 
            radius={100} 
            depth={50} 
            count={5000} 
            factor={4} 
            saturation={0} 
            fade 
            speed={1} 
         />
      )}
    </group>
  );
};

export default Stars;
