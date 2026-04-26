import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const RadarDisplay = () => {
  const sweepRef = useRef(null);

  useEffect(() => {
    // Continuous rotation for radar sweep
    gsap.to(sweepRef.current, {
      rotation: 360,
      duration: 4,
      repeat: -1,
      ease: "none",
      transformOrigin: "100% 100%"
    });
  }, []);

  return (
    <div className="radar-container">
      {/* Concentric circles */}
      <div className="radar-circle circle-1"></div>
      <div className="radar-circle circle-2"></div>
      <div className="radar-circle circle-3"></div>
      
      {/* Crosshairs */}
      <div className="radar-crosshair vertical"></div>
      <div className="radar-crosshair horizontal"></div>

      {/* Radar sweep */}
      <div 
        ref={sweepRef}
        className="radar-sweep"
      ></div>

      {/* Blips */}
      <div className="radar-blip blip-1"></div>
      <div className="radar-blip blip-2"></div>
      <div className="radar-blip blip-3"></div>
    </div>
  );
};

export default RadarDisplay;
