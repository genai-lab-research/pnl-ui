import React from 'react';
import { styled } from '@mui/material/styles';
import { 
  Table,
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  Tooltip,
  IconButton,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloudIcon from '@mui/icons-material/Cloud';
import CubeIcon from '@mui/icons-material/ViewInAr';
import ErrorIcon from '@mui/icons-material/Error';
import HelpIcon from '@mui/icons-material/Help';
import clsx from 'clsx';
import Chip from '../Chip/Chip';

export type ContainerType = 'virtual-farm' | 'farm-container';
export type ContainerStatus = 'Connected' | 'Maintenance' | 'Created' | 'Inactive';

export interface ContainerRowData {
  /**
   * The unique identifier of the container
   */
  id?: string;
  
  /**
   * The type of container
   */
  type: ContainerType;
  
  /**
   * The name or identifier of the container
   */
  name: string;
  
  /**
   * The tenant associated with the container
   */
  tenant: string;
  
  /**
   * The purpose of the container
   */
  purpose: string;
  
  /**
   * The location of the container
   */
  location: string;
  
  /**
   * The current status of the container
   */
  status: ContainerStatus;
  
  /**
   * The date when the container was created
   */
  created: string;
  
  /**
   * The date when the container was last modified
   */
  modified: string;
  
  /**
   * Whether the container has alerts
   */
  hasAlerts: boolean;
}

export interface ContainerTableProps {
  /**
   * Array of container rows to display
   */
  rows: ContainerRowData[];
  
  /**
   * Optional className to apply to the root component
   */
  className?: string;
  
  /**
   * Whether the table should have a sticky header
   * @default false
   */
  stickyHeader?: boolean;
  
  /**
   * Maximum height of the table before scrolling
   */
  maxHeight?: number | string;
  
  /**
   * Whether to apply zebra striping to rows
   * @default false
   */
  zebraStriping?: boolean;
  
  /**
   * Whether the table should take the full width of its container
   * @default true
   */
  fullWidth?: boolean;
  
  /**
   * Border color for the table
   * @default "#E9EDF4"
   */
  borderColor?: string;
  
  /**
   * Header background color
   * @default "#F5F5F7"
   */
  headerBgColor?: string;
  
  /**
   * Text color for the header
   * @default "rgba(76, 78, 100, 0.87)"
   */
  headerTextColor?: string;
  
  /**
   * Function called when row action button is clicked
   */
  onActionClick?: (row: ContainerRowData, index: number) => void;
  
  /**
   * Function called when a row is clicked
   */
  onRowClick?: (row: ContainerRowData, index: number) => void;
}

// Styled components
const StyledTableContainer = styled(TableContainer, {
  shouldForwardProp: (prop) => !['maxHeight', 'fullWidth', 'borderColor'].includes(prop as string),
})<{ maxHeight?: number | string; fullWidth?: boolean; borderColor?: string }>(
  ({ theme, maxHeight, fullWidth, borderColor }) => ({
    maxHeight: maxHeight || 'none',
    width: fullWidth ? '100%' : 'auto',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${borderColor || '#E9EDF4'}`,
    boxShadow: 'none',
    overflow: 'auto',
    
    // Responsive styling
    [theme.breakpoints.down('sm')]: {
      borderRadius: theme.shape.borderRadius / 2,
      fontSize: '0.875rem',
    },
  })
);

const StyledTable = styled(Table)(({ theme }) => ({
  borderCollapse: 'separate',
  borderSpacing: 0,
  fontFamily: 'Inter, sans-serif',
  
  '& .MuiTableCell-root': {
    fontFamily: 'Inter, sans-serif',
    padding: '12px 16px',
    
    [theme.breakpoints.down('sm')]: {
      padding: '8px 12px',
    },
  },
}));

const StyledTableHead = styled(TableHead, {
  shouldForwardProp: (prop) => !['headerBgColor'].includes(prop as string),
})<{ headerBgColor?: string }>(
  ({ headerBgColor }) => ({
    '& .MuiTableRow-root': {
      backgroundColor: headerBgColor || '#F5F5F7',
      '& .MuiTableCell-root': {
        borderBottom: 'none',
      },
    },
  })
);

const StyledHeaderCell = styled(TableCell, {
  shouldForwardProp: (prop) => !['headerTextColor'].includes(prop as string),
})<{ headerTextColor?: string }>(
  ({ theme, headerTextColor }) => ({
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '24px',
    color: headerTextColor || 'rgba(76, 78, 100, 0.87)',
    textTransform: 'uppercase',
    letterSpacing: '0.17px',
    
    // Responsive styling
    [theme.breakpoints.down('sm')]: {
      fontSize: '10px',
      lineHeight: '20px',
      letterSpacing: '0.15px',
    },
  })
);

const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => !['isZebra', 'index', 'clickable'].includes(prop as string),
})<{ isZebra?: boolean; index: number; clickable?: boolean }>(
  ({ isZebra, index, clickable }) => ({
    backgroundColor: isZebra && index % 2 === 1 ? '#FAFAFA' : '#FFFFFF',
    cursor: clickable ? 'pointer' : 'default',
    '& .MuiTableCell-root': {
      borderBottom: '1px solid #E9EDF4',
    },
    '&:last-child .MuiTableCell-root': {
      borderBottom: 'none',
    },
    '&:hover': clickable ? {
      backgroundColor: isZebra && index % 2 === 1 ? '#F0F0F0' : '#F9F9F9',
    } : {},
  })
);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '14px',
  lineHeight: '20px',
  color: '#000000',
  fontWeight: 400,
  
  // Responsive styling
  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
    lineHeight: '18px',
  },
}));

const TruncatedCell = styled('div')({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '100%',
});

const TypeIconWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
});

const AlertIconWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

/**
 * ContainerTable component for displaying container information
 * 
 * A responsive and customizable table component that displays container data with
 * type icons, status indicators, alerts, and action buttons.
 * 
 * @component
 */
export const ContainerTable: React.FC<ContainerTableProps> = ({
  rows,
  className,
  stickyHeader = false,
  maxHeight,
  zebraStriping = false,
  fullWidth = true,
  borderColor = "#E9EDF4",
  headerBgColor = "#F5F5F7",
  headerTextColor = "rgba(76, 78, 100, 0.87)",
  onActionClick,
  onRowClick,
}) => {
  // Helper function to render container type icon
  const renderTypeIcon = (type: ContainerType) => {
    if (type === 'virtual-farm') {
      return (
        <TypeIconWrapper>
          <CloudIcon fontSize="small" />
        </TypeIconWrapper>
      );
    } else if (type === 'farm-container') {
      return (
        <TypeIconWrapper>
          <CubeIcon fontSize="small" />
        </TypeIconWrapper>
      );
    }
    
    return (
      <TypeIconWrapper>
        <HelpIcon fontSize="small" />
      </TypeIconWrapper>
    );
  };
  
  // Helper function to render status chip
  const renderStatusChip = (status: ContainerStatus) => {
    let chipStatus: 'active' | 'inactive' | 'default' | 'in-progress';
    
    switch (status) {
      case 'Connected':
        chipStatus = 'active';
        break;
      case 'Maintenance':
        chipStatus = 'in-progress';
        break;
      case 'Created':
        chipStatus = 'default';
        break;
      case 'Inactive':
        chipStatus = 'inactive';
        break;
      default:
        chipStatus = 'default';
    }
    
    return <Chip value={status} status={chipStatus} />;
  };
  
  // Helper function to render alert icon
  const renderAlertIcon = (hasAlerts: boolean) => {
    if (hasAlerts) {
      return (
        <AlertIconWrapper>
          <ErrorIcon style={{ color: '#d32f2f' }} />
        </AlertIconWrapper>
      );
    }
    
    return (
      <AlertIconWrapper>
        <HelpIcon style={{ color: '#E0E0E0' }} />
      </AlertIconWrapper>
    );
  };

  return (
    <StyledTableContainer 
      component={Paper}
      className={clsx('container-table', className)}
      maxHeight={maxHeight}
      fullWidth={fullWidth}
      borderColor={borderColor}
    >
      <StyledTable stickyHeader={stickyHeader} aria-label="container table">
        <StyledTableHead headerBgColor={headerBgColor}>
          <TableRow>
            <StyledHeaderCell headerTextColor={headerTextColor}>Type</StyledHeaderCell>
            <StyledHeaderCell headerTextColor={headerTextColor}>Name</StyledHeaderCell>
            <StyledHeaderCell headerTextColor={headerTextColor}>Tenant</StyledHeaderCell>
            <StyledHeaderCell headerTextColor={headerTextColor}>Purpose</StyledHeaderCell>
            <StyledHeaderCell headerTextColor={headerTextColor}>Location</StyledHeaderCell>
            <StyledHeaderCell headerTextColor={headerTextColor}>Status</StyledHeaderCell>
            <StyledHeaderCell headerTextColor={headerTextColor}>Created</StyledHeaderCell>
            <StyledHeaderCell headerTextColor={headerTextColor}>Modified</StyledHeaderCell>
            <StyledHeaderCell headerTextColor={headerTextColor}>Alerts</StyledHeaderCell>
            <StyledHeaderCell headerTextColor={headerTextColor}>Actions</StyledHeaderCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {rows.map((row, index) => (
            <StyledTableRow 
              key={index} 
              isZebra={zebraStriping} 
              index={index}
              clickable={!!onRowClick}
              onClick={() => onRowClick && onRowClick(row, index)}
            >
              <StyledTableCell>{renderTypeIcon(row.type)}</StyledTableCell>
              <StyledTableCell>
                <Tooltip title={row.name} arrow placement="top">
                  <TruncatedCell>{row.name}</TruncatedCell>
                </Tooltip>
              </StyledTableCell>
              <StyledTableCell>
                <Tooltip title={row.tenant} arrow placement="top">
                  <TruncatedCell>{row.tenant}</TruncatedCell>
                </Tooltip>
              </StyledTableCell>
              <StyledTableCell>
                <Tooltip title={row.purpose} arrow placement="top">
                  <TruncatedCell>{row.purpose}</TruncatedCell>
                </Tooltip>
              </StyledTableCell>
              <StyledTableCell>
                <Tooltip title={row.location} arrow placement="top">
                  <TruncatedCell>{row.location}</TruncatedCell>
                </Tooltip>
              </StyledTableCell>
              <StyledTableCell>{renderStatusChip(row.status)}</StyledTableCell>
              <StyledTableCell>{row.created}</StyledTableCell>
              <StyledTableCell>{row.modified}</StyledTableCell>
              <StyledTableCell>{renderAlertIcon(row.hasAlerts)}</StyledTableCell>
              <StyledTableCell>
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row click when action button is clicked
                    onActionClick && onActionClick(row, index);
                  }}
                  aria-label="Actions"
                >
                  <MoreVertIcon color="action" />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  );
};

export default ContainerTable;