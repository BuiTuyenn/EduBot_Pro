import React from 'react';

const Logo = ({ className = "w-12 h-12" }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="logoGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      
      {/* Graduation Cap - Larger and centered */}
      <path 
        d="M60 25 L105 45 L60 65 L15 45 Z" 
        fill="url(#logoGradient)"
      />
      <path 
        d="M60 65 L60 80 L40 70 L40 55 Z" 
        fill="url(#logoGradient)"
        opacity="0.8"
      />
      <rect x="103" y="43" width="4" height="35" rx="2" fill="url(#logoGradient)" />
      
      {/* Chat Bubble - Larger */}
      <circle 
        cx="80" 
        cy="85" 
        r="25" 
        fill="url(#logoGradient2)"
      />
      <path 
        d="M80 105 L76 112 L76 105 Z" 
        fill="url(#logoGradient2)"
      />
      
      {/* Dots inside chat bubble - Larger */}
      <circle cx="72" cy="85" r="3" fill="white" />
      <circle cx="80" cy="85" r="3" fill="white" />
      <circle cx="88" cy="85" r="3" fill="white" />
    </svg>
  );
};

export default Logo;

