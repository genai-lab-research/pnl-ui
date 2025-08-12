/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

interface SearchIconProps {
  width?: number;
  height?: number;
  className?: string;
}

const iconStyles = css`
  flex-shrink: 0;
  opacity: 0.6;
`;

const SearchIcon: React.FC<SearchIconProps> = ({ 
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
      d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
      stroke="#71717A"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.9995 14.0005L11.1328 11.1338"
      stroke="#71717A"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SearchIcon;