/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

interface ChevronDownIconProps {
  width?: number;
  height?: number;
  className?: string;
}

const iconStyles = css`
  flex-shrink: 0;
  opacity: 0.7;
`;

const ChevronDownIcon: React.FC<ChevronDownIconProps> = ({ 
  width = 16, 
  height = 16, 
  className 
}) => (
  <svg 
    css={iconStyles}
    width={width} 
    height={height} 
    viewBox="0 0 16 16" 
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M4 6L8 10L12 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ChevronDownIcon;