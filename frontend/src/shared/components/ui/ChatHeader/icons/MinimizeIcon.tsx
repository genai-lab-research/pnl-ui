import React from 'react';

export const MinimizeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9 9L3 3m0 0v5m0-5h5m7 7l6-6m0 0v5m0-5h-5m-7 7l-6 6m0 0h5m-5 0v-5m7 7l6 6m0 0h-5m5 0v-5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default MinimizeIcon;