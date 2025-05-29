import React from 'react';
import { TableRow, TableCell, styled } from '@mui/material';
import Chip from '../Chip/Chip';
import CloudIcon from '@mui/icons-material/Cloud';
import ErrorIcon from '@mui/icons-material/Error';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export type ContainerEnvironment = 'PROD' | 'DEV';

export interface ContainerRowData {
  /**
   * Cloud icon indicates a virtual farm container
   */
  isVirtualFarm?: boolean;
  /**
   * Container name or identifier
   */
  name: string;
  /**
   * Container environments (PROD/DEV tags)
   */
  environments?: ContainerEnvironment[];
  /**
   * Tenant identifier
   */
  tenant: string;
  /**
   * Purpose of the container
   */
  purpose: string;
  /**
   * Geographic location
   */
  location: string;
  /**
   * Current connection status
   */
  status: 'Connected' | 'Disconnected' | 'Maintenance' | 'Created' | 'Inactive';
  /**
   * Creation date string
   */
  created: string;
  /**
   * Last modified date string
   */
  modified: string;
  /**
   * Indicates if container has alerts
   */
  hasAlerts?: boolean;
}

export interface ContainerRowProps {
  /**
   * Row data object
   */
  data: ContainerRowData;
  /**
   * Called when more actions icon is clicked
   */
  onActionsClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /**
   * Optional custom className
   */
  className?: string;
  /**
   * Border color for cells
   */
  borderColor?: string;
  /**
   * Whether the row is striped (for zebra striping)
   */
  isStriped?: boolean;
}

const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => !['borderColor', 'isStriped'].includes(prop as string),
})<{ borderColor?: string; isStriped?: boolean }>(({ borderColor, isStriped }) => ({
  '& .MuiTableCell-root': {
    borderBottom: `1px solid ${borderColor || 'rgba(76, 78, 100, 0.1)'}`,
    padding: '12px 16px',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    lineHeight: '20px',
    color: 'rgba(0, 0, 0, 0.87)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  ...(isStriped && {
    backgroundColor: 'rgba(76, 78, 100, 0.02)',
  }),
}));

const TypeCell = styled(TableCell)({
  width: '48px',
  '& svg': {
    fontSize: '20px',
    color: 'rgba(0, 0, 0, 0.6)',
  },
});

const NameCell = styled(TableCell)({
  maxWidth: '200px',
});

const EnvCell = styled(TableCell)({
  '& .env-container': {
    display: 'flex',
    gap: '8px',
  },
});

const StatusCell = styled(TableCell)({
  width: '120px',
});

const AlertCell = styled(TableCell)({
  width: '48px',
  '& svg': {
    fontSize: '20px',
    color: '#FF0000',
  },
});

const ActionsCell = styled(TableCell)({
  width: '48px',
  '& svg': {
    fontSize: '20px',
    cursor: 'pointer',
    color: '#727272',
  },
});

const EnvironmentChip = styled('div')({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  fontWeight: 600,
  padding: '2px 8px',
  height: '20px',
  borderRadius: '4px',
  border: '1px solid #E5E7EB',
  backgroundColor: 'transparent',
  color: '#09090B',
  fontFamily: 'Inter, sans-serif',
});

/**
 * ContainerRow Component
 * 
 * A table row component that displays container information in a structured format.
 * Designed to be used within a Table component, it shows important container details
 * including type, name, tenant, purpose, location, status, and dates.
 * 
 * Features:
 * - Container type indicator with cloud icon for virtual farms
 * - Environment tags (PROD/DEV)
 * - Status indicator with color-coded chip
 * - Alert indicator for containers with issues
 * - Actions button for additional operations
 * - Consistent styling matching design specifications
 */
export const ContainerRow: React.FC<ContainerRowProps> = ({
  data,
  onActionsClick,
  className,
  borderColor,
  isStriped = false,
}) => {
  // Map status to chip status
  const getChipStatus = (status: ContainerRowData['status']) => {
    switch (status) {
      case 'Connected':
        return 'active';
      case 'Maintenance':
      case 'Created':
        return 'in-progress';
      case 'Inactive':
      case 'Disconnected':
        return 'inactive';
      default:
        return 'default';
    }
  };

  return (
    <StyledTableRow className={className} borderColor={borderColor} isStriped={isStriped}>
      <TypeCell>
        {data.isVirtualFarm && <CloudIcon />}
      </TypeCell>
      
      <NameCell>
        {data.name}
      </NameCell>
      
      <EnvCell>
        <div className="env-container">
          {data.environments?.map((env) => (
            <EnvironmentChip key={env}>
              {env}
            </EnvironmentChip>
          ))}
        </div>
      </EnvCell>
      
      <TableCell>
        {data.tenant}
      </TableCell>
      
      <TableCell>
        {data.purpose}
      </TableCell>
      
      <TableCell>
        {data.location}
      </TableCell>
      
      <StatusCell>
        <Chip
          value={data.status}
          status={getChipStatus(data.status)}
          size="small"
        />
      </StatusCell>
      
      <TableCell>
        {data.created}
      </TableCell>
      
      <TableCell>
        {data.modified}
      </TableCell>
      
      <AlertCell>
        {data.hasAlerts && <ErrorIcon />}
      </AlertCell>
      
      <ActionsCell onClick={onActionsClick}>
        <MoreVertIcon />
      </ActionsCell>
    </StyledTableRow>
  );
};

export default ContainerRow;