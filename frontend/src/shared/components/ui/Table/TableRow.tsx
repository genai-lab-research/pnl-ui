import React from 'react';
import { 
  TableRow as MuiTableRow, 
  TableCell, 
  IconButton,
  Typography
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import InfoIcon from '@mui/icons-material/Info';
import CloudIcon from '@mui/icons-material/Cloud';
import { ShippingContainerIcon } from '../Icon';
import { Column, RowData, ContainerType, ContainerStatus } from '../../../types/containers';

interface TableRowProps {
  /**
   * Row data
   */
  row: RowData;
  
  /**
   * Column configurations
   */
  columns: Column[];
  
  /**
   * Handler for clicking on a row
   */
  onClick?: () => void;
  
  /**
   * Handler for clicking on action button
   */
  onActionClick?: () => void;
  
  /**
   * Props for status chip component
   */
  statusChipProps: {
    variant: 'connected' | 'maintenance' | 'created' | 'inactive';
  };
  
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * TableRow component for displaying data in a table
 */
const TableRow: React.FC<TableRowProps> = ({
  row,
  columns,
  onClick,
  onActionClick,
  statusChipProps,
  className,
}) => {
  // Render status chip based on the variant - updated to match the reference UI
  const renderStatusChip = () => {
    switch (row.status) {
      case ContainerStatus.ACTIVE:
        return (
          <div style={{ 
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: 500,
            borderRadius: '16px',
            backgroundColor: '#E8F5E9',
            color: '#2E7D32',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '24px'
          }}>
            Connected
          </div>
        );
      case ContainerStatus.MAINTENANCE:
        return (
          <div style={{ 
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: 500,
            borderRadius: '16px',
            backgroundColor: '#FFF3E0',
            color: '#E65100',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '24px'
          }}>
            Maintenance
          </div>
        );
      case ContainerStatus.INACTIVE:
        return (
          <div style={{ 
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: 500,
            borderRadius: '16px',
            backgroundColor: '#757575', // Updated to match reference (lighter grey)
            color: '#FFFFFF',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '24px'
          }}>
            Inactive
          </div>
        );
      case ContainerStatus.CREATED:
        return (
          <div style={{ 
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: 500,
            borderRadius: '16px',
            backgroundColor: '#F5F5F5', // Updated to match reference
            color: '#616161', // Updated to match reference
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '24px'
          }}>
            Created
          </div>
        );
      default:
        return null;
    }
  };

  // Render type icon based on row type - updated to match the reference UI
  const renderTypeIcon = () => {
    if (row.type === ContainerType.VIRTUAL) {
      return (
        <CloudIcon sx={{ 
          fontSize: 24, 
          color: '#9E9E9E', // Lighter color to match reference
          opacity: 0.8 // Added opacity for subtlety
        }} />
      );
    } else if (row.type === ContainerType.PHYSICAL) {
      return (
        <ShippingContainerIcon sx={{ 
          fontSize: 24, 
          color: '#9E9E9E', // Lighter color to match reference
          opacity: 0.8 // Added opacity for subtlety
        }} />
      );
    }
    return null;
  };

  // Render alert icon - updated to match the reference UI
  const renderAlertIcon = () => {
    if (Number(row.alerts) > 0) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ErrorIcon sx={{ 
            color: '#F44336', // Brighter red to match reference
            fontSize: 20,
            opacity: 0.9 // Slightly more visible
          }} />
        </div>
      );
    }
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <InfoIcon sx={{ 
          color: '#BDBDBD', // Lighter grey to match reference
          fontSize: 20,
          opacity: 0.7 // More subtle for info icons
        }} />
      </div>
    );
  };

  // Render cell content based on column ID
  const renderCellContent = (columnId: string) => {
    switch (columnId) {
      case 'type':
        return renderTypeIcon();
      case 'status':
        return renderStatusChip();
      case 'alerts':
        return renderAlertIcon();
      case 'actions':
        return (
          <IconButton
            aria-label="more actions"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onActionClick?.();
            }}
            sx={{ color: '#9E9E9E' }} // Matched to reference
          >
            <MoreVertIcon />
          </IconButton>
        );
      default:
        return (
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'block',
              color: '#212121'
            }}
          >
            {row[columnId as keyof RowData]}
          </Typography>
        );
    }
  };

  return (
    <MuiTableRow
      className={className}
      onClick={onClick}
      hover
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      }}
    >
      {columns.map((column) => (
        <TableCell
          key={column.id}
          align={column.align || 'left'}
          sx={{
            padding: '12px 16px', // Updated padding to match reference
            height: '56px', // Increased height slightly to match reference
            borderBottom: '1px solid',
            borderColor: '#E0E0E0',
            '&:first-of-type': {
              paddingLeft: 2,
            },
            '&:last-of-type': {
              paddingRight: 2,
            },
          }}
        >
          {renderCellContent(column.id)}
        </TableCell>
      ))}
    </MuiTableRow>
  );
};

export default TableRow;