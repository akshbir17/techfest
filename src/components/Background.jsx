import React, { useEffect, useRef } from 'react';

const Background = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle setup
    const particleCount = Math.min(Math.floor((width * height) / 22000), 55);
    const particles = [];
    const colors = [
      'rgba(211, 47, 47, ',   // Crimson
      'rgba(244, 234, 204, ',  // Cream / Parchment
      'rgba(180, 20, 20, ',   // Deep Crimson
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.6,
        baseColor: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.45 + 0.15,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.45 - 0.15, // Gentle upward drift
        wobbleSpeed: Math.random() * 0.02 + 0.005,
        wobbleAngle: Math.random() * Math.PI * 2,
        wobbleRadius: Math.random() * 1.2 + 0.3,
      });
    }

    let lastScrollY = window.scrollY;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const currentScrollY = window.scrollY;
      const scrollDiff = (currentScrollY - lastScrollY) * 0.12;
      lastScrollY = currentScrollY;

      // Draw faint connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.08;
            ctx.strokeStyle = `rgba(211, 47, 47, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.wobbleAngle += p.wobbleSpeed;
        p.x += p.vx + Math.cos(p.wobbleAngle) * (p.wobbleRadius * 0.2);
        p.y += p.vy - scrollDiff;

        // Wrap around bounds
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        } else if (p.y > height + 10) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Subtle glow around particles
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = p.baseColor + (p.alpha * 0.25) + ')';
        ctx.fill();

        // Core particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.baseColor + p.alpha + ')';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
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
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Ambient Crimson Glow - Top Center (Hero section radiance) */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '75vw',
          maxWidth: '1100px',
          height: '650px',
          background: 'radial-gradient(ellipse at 50% 30%, rgba(211, 47, 47, 0.16) 0%, rgba(154, 0, 0, 0.06) 45%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Ambient Crimson Glow - Mid Left */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '-10%',
          width: '50vw',
          maxWidth: '650px',
          height: '600px',
          background: 'radial-gradient(ellipse at 30% 50%, rgba(154, 0, 0, 0.11) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* Ambient Crimson Glow - Bottom Right */}
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '-10%',
          width: '55vw',
          maxWidth: '700px',
          height: '650px',
          background: 'radial-gradient(ellipse at 70% 50%, rgba(211, 47, 47, 0.12) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle Tech Geometric Grid Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(211, 47, 47, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(211, 47, 47, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 40%, rgba(0, 0, 0, 0.2) 80%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 40%, rgba(0, 0, 0, 0.2) 80%, transparent 100%)',
          opacity: 0.85,
          pointerEvents: 'none',
        }}
      />

      {/* Subtle Dynamic Particle Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />

      {/* Vignette border to preserve contrast at screen edges */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(8, 8, 8, 0.6) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default Background;
