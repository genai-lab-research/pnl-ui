import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../../../../styles';
import { StatusVariant } from '../types';

interface StatusChipProps {
  variant: StatusVariant;
  children: React.ReactNode;
}

const ChipContainer = styled.div<{ variant: StatusVariant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.pill};
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};
  line-height: ${theme.lineHeights.tight};
  text-align: center;
  white-space: nowrap;
  
  background-color: ${props => {
    switch (props.variant) {
      case 'Active':
        return theme.colors.success;
      case 'Maintenance':
        return theme.colors.warning;
      case 'Inactive':
        return theme.colors.inactive;
      case 'Created':
        return theme.colors.created;
      default:
        return theme.colors.created;
    }
  }};
  
  color: ${props => {
    switch (props.variant) {
      case 'Active':
      case 'Maintenance':
      case 'Inactive':
        return theme.colors.textOnPrimary;
      case 'Created':
        return theme.colors.textOnSecondary;
      default:
        return theme.colors.textOnSecondary;
    }
  }};
`;

/**
 * StatusChip component for displaying status badges in the table
 * @param variant - The status variant that determines the color scheme
 * @param children - The content to display in the chip
 */
export const StatusChip: React.FC<StatusChipProps> = ({ variant, children }) => {
  return (
    <ChipContainer variant={variant}>
      {children}
    </ChipContainer>
  );
};