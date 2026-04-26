import React, { useState, useEffect } from 'react';

const Loader = ({ onLoaded }) => {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  
  const loadingTexts = [
    "INITIALIZING SYSTEMS...",
    "LOADING PAYLOAD...",
    "CALIBRATING TRAJECTORY...",
    "T-MINUS..."
  ];

  useEffect(() => {
    // Simulate loading progress
    const duration = 3000;
    const interval = 50;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const currentProgress = Math.min((step / steps) * 100, 100);
      setProgress(currentProgress);
      
      const newTextIndex = Math.floor((step / steps) * loadingTexts.length);
      if (newTextIndex < loadingTexts.length) {
        setTextIndex(newTextIndex);
      }

      if (step >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          onLoaded();
        }, 500);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onLoaded]);

  return (
    <div className="loader-container">
      <div className="loader-content">
        <h2 className="loader-text">{loadingTexts[textIndex]}</h2>
        <div className="loader-bar-container">
          <div 
            className="loader-bar"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="loader-percentage">{Math.floor(progress)}%</div>
      </div>
    </div>
  );
};

export default Loader;
