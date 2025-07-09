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
    <path d="M12 3C11.45 3 11 3.45 11 4V5H13V4C13 3.45 12.55 3 12 3Z" />
    <path d="M13 8V5H11V8H4C3.45 8 3 8.45 3 9V19C3 19.55 3.45 20 4 20H20C20.55 20 21 19.55 21 19V9C21 8.45 20.55 8 20 8H13ZM8 17C6.9 17 6 16.1 6 15C6 13.9 6.9 13 8 13C9.1 13 10 13.9 10 15C10 16.1 9.1 17 8 17ZM16 17C14.9 17 14 16.1 14 15C14 13.9 14.9 13 16 13C17.1 13 18 13.9 18 15C18 16.1 17.1 17 16 17Z" />
  </svg>
);

export default BotIcon;