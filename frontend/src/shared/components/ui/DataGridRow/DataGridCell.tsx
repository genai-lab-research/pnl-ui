import React from 'react';
import { DataGridCell as StyledDataGridCell } from './DataGridRow.styles';
import { DataGridCellProps } from './types';

const DataGridCell: React.FC<DataGridCellProps> = ({ 
  children, 
  grow = false,
  align = 'left'
}) => {
  return (
    <StyledDataGridCell 
      grow={grow} 
      style={{ justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center' }}
    >
      {children}
    </StyledDataGridCell>
  );
};

export default DataGridCell;