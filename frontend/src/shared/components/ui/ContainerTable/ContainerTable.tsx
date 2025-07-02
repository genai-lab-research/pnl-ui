import React from 'react';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import ShippingContainerIcon from './icons/shipping-container.svg';
import { Container } from '../../../types/containers';
import { StatusChip, StatusType } from '../StatusChip';

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

const AlertIndicator = styled(Box)<{ hasAlert: boolean }>(({ hasAlert }) => ({
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

interface ContainerTableProps {
  containers: Container[];
  onRowAction?: (container: Container, action: string) => void;
  onRowClick?: (container: Container) => void;
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
  return `${location.city}, ${location.country}`;
};

export const ContainerTable: React.FC<ContainerTableProps> = ({
  containers,
  onRowAction,
  onRowClick,
}) => {
  const handleActionClick = (container: Container, event: React.MouseEvent) => {
    event.stopPropagation();
    onRowAction?.(container, 'menu');
  };

  const handleRowClick = (container: Container) => {
    onRowClick?.(container);
  };

  return (
    <StyledTableContainer>
      <Table>
        <StyledTableHead>
          <TableRow>
            <StyledHeaderCell>Type</StyledHeaderCell>
            <StyledHeaderCell>Name</StyledHeaderCell>
            <StyledHeaderCell>Tenant</StyledHeaderCell>
            <StyledHeaderCell>Purpose</StyledHeaderCell>
            <StyledHeaderCell>Location</StyledHeaderCell>
            <StyledHeaderCell>Status</StyledHeaderCell>
            <StyledHeaderCell>Created</StyledHeaderCell>
            <StyledHeaderCell>Modified</StyledHeaderCell>
            <StyledHeaderCell>Alerts</StyledHeaderCell>
            <StyledHeaderCell>Actions</StyledHeaderCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {containers.map((container) => (
            <StyledTableRow key={container.id} onClick={() => handleRowClick(container)}>
              <StyledTableCell>
                <TypeIcon>
                  {container.type === 'virtual' ? (
                    <CloudQueueIcon sx={{ fontSize: '16px', color: '#4C4E64' }} />
                  ) : (
                    <img src={ShippingContainerIcon} alt="Container icon" width={16} height={16} />
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
                  onClick={(event) => handleActionClick(container, event)}
                  sx={{ color: '#4C4E64' }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};