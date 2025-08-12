import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../../../../styles';

interface TableIconProps {
  src: string;
  alt: string;
  onClick?: (e?: React.MouseEvent) => void;
}

const IconWrapper = styled.div<{ clickable?: boolean }>`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  
  svg, img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: ${theme.spacing.xs};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.sm};
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${theme.colors.hover};
  }
  
  &:active {
    background-color: ${theme.colors.active};
  }
  
  &:focus {
    outline: 2px solid ${theme.colors.focus};
    outline-offset: 2px;
  }
`;

/**
 * TableIcon component for displaying icons in table cells
 * @param src - The source URL of the icon
 * @param alt - The alt text for accessibility
 * @param onClick - Optional click handler for interactive icons
 */
export const TableIcon: React.FC<TableIconProps> = ({ src, alt, onClick }) => {
  const icon = (
    <IconWrapper clickable={!!onClick}>
      <img src={src} alt={alt} />
    </IconWrapper>
  );

  if (onClick) {
    return (
      <ActionButton onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }} aria-label={alt}>
        {icon}
      </ActionButton>
    );
  }

  return icon;
};