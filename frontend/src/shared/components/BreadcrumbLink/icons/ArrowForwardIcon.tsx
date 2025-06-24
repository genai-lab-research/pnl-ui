import React from 'react';

const ArrowForwardIcon: React.FC = () => {
  return (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: 'rotate(180deg)' }}
    >
      <path 
        d="M10 6L4 12L10 18" 
        stroke="#000000" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowForwardIcon;