import React from 'react';

export const ExpandIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path 
      d="M3 8V3H8M3 3L9 9M21 8V3H16M21 3L15 9M3 16V21H8M3 21L9 15M21 16V21H16M21 21L15 15" 
      stroke="#E3E3E3" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export default ExpandIcon;