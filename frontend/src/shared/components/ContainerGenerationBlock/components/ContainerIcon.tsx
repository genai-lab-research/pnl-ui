import React from 'react';

export interface ContainerIconProps {
  className?: string;
}

/**
 * Container icon for the ContainerGenerationBlock component
 */
export const ContainerIcon: React.FC<ContainerIconProps> = ({ className }) => {
  return (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 16 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M12 3H4C3.5 3 3 3.5 3 4V12C3 12.5 3.5 13 4 13H12C12.5 13 13 12.5 13 12V4C13 3.5 12.5 3 12 3Z" 
        stroke="#09090B" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none"
      />
      <ellipse 
        cx="8" 
        cy="8" 
        rx="4" 
        ry="2" 
        stroke="#09090B" 
        strokeWidth="1.5" 
        fill="none"
      />
    </svg>
  );
};