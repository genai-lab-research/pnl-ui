import React from 'react';

export const BotIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M9 15C9 15 10.5 16.5 12 16.5C13.5 16.5 15 15 15 15M8.5 10H8.51M15.5 10H15.51M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill="none"
    />
    <circle cx="12" cy="2" r="1" fill="currentColor" />
    <path d="M12 3V7" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export default BotIcon;