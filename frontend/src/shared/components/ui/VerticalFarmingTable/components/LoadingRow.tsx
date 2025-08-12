import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { theme } from '../../../../../styles';
import { TableRow, TableCell, IconCell } from '../styles';

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const SkeletonBox = styled.div<{ width?: string; height?: string }>`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '16px'};
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: ${theme.borderRadius.sm};
`;

const SkeletonChip = styled(SkeletonBox)`
  width: 80px;
  height: 24px;
  border-radius: ${theme.borderRadius.pill};
`;

const SkeletonCircle = styled(SkeletonBox)`
  width: 16px;
  height: 16px;
  border-radius: 50%;
`;

interface LoadingRowProps {
  key?: string | number;
}

/**
 * LoadingRow component that displays skeleton loading states for table rows
 */
export const LoadingRow: React.FC<LoadingRowProps> = () => {
  return (
    <TableRow>
      <IconCell width="icon">
        <SkeletonCircle />
      </IconCell>
      
      <TableCell>
        <SkeletonBox width="80%" />
      </TableCell>
      
      <TableCell width="fixed">
        <SkeletonBox width="70%" />
      </TableCell>
      
      <TableCell width="fixed">
        <SkeletonBox width="80%" />
      </TableCell>
      
      <TableCell>
        <SkeletonBox width="90%" />
      </TableCell>
      
      <TableCell width="fixed">
        <SkeletonChip />
      </TableCell>
      
      <TableCell width="fixed">
        <SkeletonBox width="80%" />
      </TableCell>
      
      <TableCell width="fixed">
        <SkeletonBox width="80%" />
      </TableCell>
      
      <IconCell width="icon">
        <SkeletonCircle />
      </IconCell>
      
      <IconCell width="icon">
        <SkeletonCircle />
      </IconCell>
    </TableRow>
  );
};