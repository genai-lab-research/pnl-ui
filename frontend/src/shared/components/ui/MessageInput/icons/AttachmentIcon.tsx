import React from 'react';

interface AttachmentIconProps {
  color?: string;
  size?: number;
}

export const AttachmentIcon: React.FC<AttachmentIconProps> = ({ 
  color = '#818EA1', 
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
      d="M11.5 22C9.01472 22 7 19.9853 7 17.5V6C7 3.79086 8.79086 2 11 2C13.2091 2 15 3.79086 15 6V16C15 17.1046 14.1046 18 13 18C11.8954 18 11 17.1046 11 16V6.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);