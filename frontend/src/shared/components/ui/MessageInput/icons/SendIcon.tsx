import React from 'react';

interface SendIconProps {
  color?: string;
  size?: number;
}

export const SendIcon: React.FC<SendIconProps> = ({ 
  color = '#FFFFFF', 
  size = 24 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 21L23 12L2 3V10L17 12L2 14V21Z"
      fill={color}
    />
  </svg>
);