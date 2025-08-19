import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../../../../styles';
import { TableRow, TableCell } from '../styles';

const EmptyStateContainer = styled.div`
  padding: ${theme.spacing.xxl} ${theme.spacing.lg};
  text-align: center;
  background-color: ${theme.colors.backgroundSecondary};
  border: 1px solid ${theme.colors.borderSecondary};
  border-radius: ${theme.borderRadius.md};
  margin: ${theme.spacing.lg};
`;

const EmptyStateTitle = styled.h3`
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.textPrimary};
  margin: 0 0 ${theme.spacing.sm} 0;
`;

const EmptyStateMessage = styled.p`
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
  margin: 0;
  line-height: ${theme.lineHeights.normal};
`;

interface EmptyStateProps {
  title?: string;
  message?: string;
}

/**
 * EmptyState component for displaying when no data is available
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No containers found",
  message = "Try adjusting your search criteria or create a new container."
}) => {
  return (
    <TableRow>
      <TableCell style={{ padding: 0, flex: '1', minWidth: '100%' }}>
        <EmptyStateContainer>
          <EmptyStateTitle>{title}</EmptyStateTitle>
          <EmptyStateMessage>{message}</EmptyStateMessage>
        </EmptyStateContainer>
      </TableCell>
    </TableRow>
  );
};