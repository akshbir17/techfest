import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Background = () => {
  const bgImageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Subtle parallax effect for the background image
      gsap.to(bgImageRef.current, {
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
        y: '20%', // Moves the background slightly down as you scroll down
        ease: 'none'
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        backgroundColor: 'var(--color-space-black)',
        overflow: 'hidden'
      }}
    >
      <div 
        ref={bgImageRef}
        style={{
          position: 'absolute',
          top: '-10%',
          left: 0,
          width: '100%',
          height: '120%',
          backgroundImage: 'url("/dragon_bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.4, // Keep it dim so text is readable
        }}
      ></div>
      {/* Gradient overlay for readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(8,8,8,0.2) 0%, rgba(8,8,8,0.9) 100%)',
        }}
      ></div>
    </div>
  );
};

export default Background;
