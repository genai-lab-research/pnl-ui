/** @jsxImportSource @emotion/react */
import React from 'react';

export const LeftArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 20 20" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M16.6673 9.16634H6.52565L11.184 4.50801L10.0007 3.33301L3.33398 9.99967L10.0007 16.6663L11.1757 15.4913L6.52565 10.833H16.6673V9.16634Z" 
      fill="currentColor"
    />
  </svg>
);

export const RightArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 20 20" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M10.0007 3.33301L8.82565 4.50801L13.4757 9.16634H3.33398V10.833H13.4757L8.82565 15.4913L10.0007 16.6663L16.6673 9.99967L10.0007 3.33301Z" 
      fill="currentColor"
    />
  </svg>
);