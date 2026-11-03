import React, { useEffect, useRef } from 'react';

const Background = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Ensure video plays smoothly across all browsers
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.85; // Slight cinematic slowdown
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }

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

    // Subtle floating ember particles over the video
    const particleCount = Math.min(Math.floor((width * height) / 30000), 35);
    const particles = [];
    const colors = [
      'rgba(211, 47, 47, ',   // Crimson
      'rgba(244, 234, 204, ',  // Cream
      'rgba(255, 75, 75, ',   // Bright Crimson
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        baseColor: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.4 + 0.15,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        wobbleSpeed: Math.random() * 0.02 + 0.005,
        wobbleAngle: Math.random() * Math.PI * 2,
        wobbleRadius: Math.random() * 1.2 + 0.3,
      });
    }

    let lastScrollY = window.scrollY;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const currentScrollY = window.scrollY;
      const scrollDiff = (currentScrollY - lastScrollY) * 0.1;
      lastScrollY = currentScrollY;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.wobbleAngle += p.wobbleSpeed;
        p.x += p.vx + Math.cos(p.wobbleAngle) * (p.wobbleRadius * 0.2);
        p.y += p.vy - scrollDiff;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        } else if (p.y > height + 10) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

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
        backgroundColor: '#080808',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          minWidth: '100%',
          minHeight: '100%',
          transform: 'translate(-50%, -50%)',
          objectFit: 'cover',
          opacity: 0.82,
          filter: 'contrast(1.05) saturate(1.1) brightness(0.92)',
          pointerEvents: 'none',
        }}
      >
        <source src="/bg_video.mp4" type="video/mp4" />
      </video>

      {/* Cinematic Dark & Crimson Tint Overlay (Lightened for clear visibility) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at 50% 25%, rgba(211, 47, 47, 0.08) 0%, rgba(8, 8, 8, 0.2) 50%, rgba(8, 8, 8, 0.5) 100%),
            linear-gradient(180deg, rgba(8, 8, 8, 0.1) 0%, rgba(8, 8, 8, 0.35) 100%)
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Subtle Tech Grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(211, 47, 47, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(211, 47, 47, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 40%, rgba(0, 0, 0, 0.2) 80%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 40%, rgba(0, 0, 0, 0.2) 80%, transparent 100%)',
          opacity: 0.8,
          pointerEvents: 'none',
        }}
      />

      {/* Floating Canvas Particles */}
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

      {/* Edge Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, transparent 65%, rgba(8, 8, 8, 0.45) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default Background;
