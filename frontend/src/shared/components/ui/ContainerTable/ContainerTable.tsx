import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Box,
  Tooltip,
  Popper,
  ClickAwayListener,
  TableSortLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloudIcon from '@mui/icons-material/Cloud';
import StorageIcon from '@mui/icons-material/Storage';
import { Container } from '../../../types/containers';
import { StatusChip, StatusType } from '../StatusChip';
import Menu from '../Menu/Menu';
import { MenuItem } from '../Menu/types';
import { EditContainerPanel } from '../../../../features/EditContainerPanel';

const StyledTableContainer = styled(TableContainer)(() => ({
  borderRadius: '6px',
  border: '1px solid #E9EDF4',
  boxShadow: 'none',
  overflow: 'hidden',
}));

const StyledTableHead = styled(TableHead)({
  backgroundColor: '#F8F9FA',
});

const StyledHeaderCell = styled(TableCell)({
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  fontWeight: 600,
  color: '#4C4E64',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  padding: '12px 16px',
  borderBottom: '1px solid #E9EDF4',
});

const StyledSortableHeaderCell = styled(StyledHeaderCell)({
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#F0F4F8',
  },
  '& .MuiTableSortLabel-root': {
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: 600,
    color: '#4C4E64',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    '&:hover': {
      color: '#2C5282',
    },
    '&.Mui-active': {
      color: '#2C5282',
      '& .MuiTableSortLabel-icon': {
        color: '#2C5282 !important',
      },
    },
  },
});

const StyledTableRow = styled(TableRow)({
  height: '52px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#F8F9FA',
  },
  '&:not(:last-child)': {
    borderBottom: '1px solid #E9EDF4',
  },
});

const StyledTableCell = styled(TableCell)({
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  fontWeight: 400,
  color: '#000000',
  padding: '12px 16px',
  borderBottom: 'none',
});

const TypeIcon = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const AlertIndicator = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hasAlert',
})<{ hasAlert: boolean }>(({ hasAlert }) => ({
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  backgroundColor: hasAlert ? '#DC3545' : '#6C757D',
  border: `2px solid ${hasAlert ? '#FFFFFF' : 'transparent'}`,
  position: 'relative',
  '&::after': hasAlert ? {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '6px',
    height: '6px',
    backgroundColor: '#FFFFFF',
    borderRadius: '50%',
  } : {},
}));

export type SortField = 'type' | 'name' | 'tenant' | 'purpose' | 'location' | 'status' | 'created' | 'modified';
export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  order: SortOrder;
}

interface ContainerTableProps {
  containers: Container[];
  onRowAction?: (container: Container, action: string) => void;
  onContainerUpdated?: (container: Container) => void;
  sortConfig?: SortConfig;
  onSort?: (field: SortField) => void;
}

const mapStatusToChipStatus = (status: Container['status']): StatusType => {
  switch (status) {
    case 'connected':
      return 'Connected';
    case 'maintenance':
      return 'Maintenance';
    case 'created':
      return 'Created';
    case 'inactive':
      return 'Inactive';
    case 'active':
      return 'Connected';
    default:
      return 'Created';
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatLocation = (location: Container['location']): string => {
  if (!location || !location.city || !location.country) {
    return 'Location not specified';
  }
  return `${location.city}, ${location.country}`;
};

export const ContainerTable: React.FC<ContainerTableProps> = ({
  containers,
  onRowAction,
  onContainerUpdated,
  sortConfig,
  onSort,
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [containerToEdit, setContainerToEdit] = useState<Container | null>(null);

  const handleActionClick = (event: React.MouseEvent, container: Container) => {
    event.stopPropagation();
    const target = event.currentTarget as HTMLElement;
    setAnchorEl(target);
    setSelectedContainer(container);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedContainer(null);
  };

  const handleMenuItemClick = (item: MenuItem) => {
    if (selectedContainer) {
      if (item.id === 'edit') {
        setContainerToEdit(selectedContainer);
        setEditPanelOpen(true);
      } else {
        onRowAction?.(selectedContainer, item.id);
      }
    }
    handleMenuClose();
  };

  const handleEditPanelClose = () => {
    setEditPanelOpen(false);
    setContainerToEdit(null);
  };

  const handleContainerUpdatedSuccess = (updatedContainer: Container) => {
    onContainerUpdated?.(updatedContainer);
    setEditPanelOpen(false);
    setContainerToEdit(null);
  };

  const handleRowClick = (containerId: string) => {
    navigate(`/containers/${containerId}`);
  };

  const handleSort = (field: SortField) => {
    onSort?.(field);
  };

  const getSortDirection = (field: SortField): 'asc' | 'desc' | false => {
    if (!sortConfig || sortConfig.field !== field) {
      return false;
    }
    return sortConfig.order;
  };

  const menuItems: MenuItem[] = [
    {
      id: 'view',
      label: 'View',
      action: () => selectedContainer && navigate(`/containers/${selectedContainer.id}`)
    },
    {
      id: 'edit',
      label: 'Edit & Settings'
    },
    {
      id: 'shutdown',
      label: 'Shutdown'
    }
  ];

  return (
    <StyledTableContainer>
      <Table>
        <StyledTableHead>
          <TableRow>
            <StyledSortableHeaderCell>
              <TableSortLabel
                active={getSortDirection('type') !== false}
                direction={getSortDirection('type') || 'asc'}
                onClick={() => handleSort('type')}
              >
                Type
              </TableSortLabel>
            </StyledSortableHeaderCell>
            <StyledSortableHeaderCell>
              <TableSortLabel
                active={getSortDirection('name') !== false}
                direction={getSortDirection('name') || 'asc'}
                onClick={() => handleSort('name')}
              >
                Name
              </TableSortLabel>
            </StyledSortableHeaderCell>
            <StyledSortableHeaderCell>
              <TableSortLabel
                active={getSortDirection('tenant') !== false}
                direction={getSortDirection('tenant') || 'asc'}
                onClick={() => handleSort('tenant')}
              >
                Tenant
              </TableSortLabel>
            </StyledSortableHeaderCell>
            <StyledSortableHeaderCell>
              <TableSortLabel
                active={getSortDirection('purpose') !== false}
                direction={getSortDirection('purpose') || 'asc'}
                onClick={() => handleSort('purpose')}
              >
                Purpose
              </TableSortLabel>
            </StyledSortableHeaderCell>
            <StyledSortableHeaderCell>
              <TableSortLabel
                active={getSortDirection('location') !== false}
                direction={getSortDirection('location') || 'asc'}
                onClick={() => handleSort('location')}
              >
                Location
              </TableSortLabel>
            </StyledSortableHeaderCell>
            <StyledSortableHeaderCell>
              <TableSortLabel
                active={getSortDirection('status') !== false}
                direction={getSortDirection('status') || 'asc'}
                onClick={() => handleSort('status')}
              >
                Status
              </TableSortLabel>
            </StyledSortableHeaderCell>
            <StyledSortableHeaderCell>
              <TableSortLabel
                active={getSortDirection('created') !== false}
                direction={getSortDirection('created') || 'asc'}
                onClick={() => handleSort('created')}
              >
                Created
              </TableSortLabel>
            </StyledSortableHeaderCell>
            <StyledSortableHeaderCell>
              <TableSortLabel
                active={getSortDirection('modified') !== false}
                direction={getSortDirection('modified') || 'asc'}
                onClick={() => handleSort('modified')}
              >
                Modified
              </TableSortLabel>
            </StyledSortableHeaderCell>
            <StyledHeaderCell>Alerts</StyledHeaderCell>
            <StyledHeaderCell>Actions</StyledHeaderCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {containers.map((container) => (
            <StyledTableRow 
              key={container.id}
              onClick={() => handleRowClick(container.id)}
            >
              <StyledTableCell>
                <TypeIcon>
                  {container.type === 'virtual' ? (
                    <CloudIcon sx={{ fontSize: '16px', color: '#4C4E64' }} />
                  ) : (
                    <StorageIcon sx={{ fontSize: '16px', color: '#4C4E64' }} />
                  )}
                </TypeIcon>
              </StyledTableCell>
              <StyledTableCell>
                <Typography variant="body2" fontWeight={500}>
                  {container.name}
                </Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography variant="body2" color="#4C4E64">
                  {container.tenant}
                </Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {container.purpose}
                </Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography variant="body2" color="#4C4E64">
                  {formatLocation(container.location)}
                </Typography>
              </StyledTableCell>
              <StyledTableCell>
                <StatusChip status={mapStatusToChipStatus(container.status)} />
              </StyledTableCell>
              <StyledTableCell>
                <Typography variant="body2" color="#4C4E64">
                  {formatDate(container.created)}
                </Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography variant="body2" color="#4C4E64">
                  {formatDate(container.modified)}
                </Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Tooltip title={container.has_alert ? 'Has alerts' : 'No alerts'}>
                  <AlertIndicator hasAlert={container.has_alert} />
                </Tooltip>
              </StyledTableCell>
              <StyledTableCell>
                <IconButton
                  size="small"
                  onClick={(e) => handleActionClick(e, container)}
                  sx={{ color: '#4C4E64' }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      
      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement="bottom-end"
        style={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={handleMenuClose}>
          <div>
            <Menu
              items={menuItems}
              onItemClick={handleMenuItemClick}
            />
          </div>
        </ClickAwayListener>
      </Popper>

      <EditContainerPanel
        open={editPanelOpen}
        container={containerToEdit}
        onClose={handleEditPanelClose}
        onSuccess={handleContainerUpdatedSuccess}
      />
    </StyledTableContainer>
  );
};