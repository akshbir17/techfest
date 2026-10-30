import React from 'react';

const NeonButton = ({ children, onClick, className = '', type = 'button', style = {}, ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`neon-button ${className}`}
      style={style}
      {...props}
    >
      <span className="neon-button-text">{children}</span>
      <div className="neon-button-bg"></div>
    </button>
  );
};

export default NeonButton;
