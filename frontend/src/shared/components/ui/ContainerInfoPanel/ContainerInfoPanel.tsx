import React from 'react';
import {
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { ContainerInfoPanelProps } from './types';
import { StyledInfoPanel, StyledInfoRow } from './ContainerInfoPanel.styles';

/**
 * ContainerInfoPanel component for displaying container information
 * 
 * @param props - ContainerInfoPanel props
 * @returns JSX element
 */
export const ContainerInfoPanel: React.FC<ContainerInfoPanelProps> = ({
  container,
  title = 'Container Information',
  ...props
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }) + ', ' + date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!container) {
    return (
      <StyledInfoPanel {...props}>
        <Typography variant="h6" gutterBottom fontWeight={700}>
          {title}
        </Typography>
        <Typography color="textSecondary">No container data available</Typography>
      </StyledInfoPanel>
    );
  }

  return (
    <StyledInfoPanel {...props}>
      <Typography variant="h6" gutterBottom fontWeight={700}>
        {title}
      </Typography>
      
      <Box display="flex" flexDirection="column" gap={1.5}>
        <StyledInfoRow>
          <Typography variant="body2" fontWeight={500}>Name</Typography>
          <Typography variant="body2">{container.name}</Typography>
        </StyledInfoRow>

        <StyledInfoRow>
          <Typography variant="body2" fontWeight={500}>Type</Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: '#666',
                borderRadius: '2px',
              }}
            />
            <Typography variant="body2">
              {container.type === 'physical' ? 'Physical' : 'Virtual'}
            </Typography>
          </Box>
        </StyledInfoRow>

        <StyledInfoRow>
          <Typography variant="body2" fontWeight={500}>Tenant</Typography>
          <Typography variant="body2">{container.tenant}</Typography>
        </StyledInfoRow>

        <StyledInfoRow>
          <Typography variant="body2" fontWeight={500}>Purpose</Typography>
          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
            {container.purpose}
          </Typography>
        </StyledInfoRow>

        <StyledInfoRow>
          <Typography variant="body2" fontWeight={500}>Location</Typography>
          <Typography variant="body2">
            {container.location?.address || container.location?.city || '-'}
          </Typography>
        </StyledInfoRow>

        <StyledInfoRow>
          <Typography variant="body2" fontWeight={500}>Status</Typography>
          <Chip
            label={container.status === 'active' ? 'Active' : 'Inactive'}
            size="small"
            sx={{
              backgroundColor: container.status === 'active' ? '#479F67' : '#E4E4E7',
              color: container.status === 'active' ? '#FAFAFA' : '#09090B',
              fontWeight: 600,
            }}
          />
        </StyledInfoRow>

        <StyledInfoRow>
          <Typography variant="body2" fontWeight={500}>Created</Typography>
          <Typography variant="body2">{formatDate(container.created)}</Typography>
        </StyledInfoRow>

        <StyledInfoRow>
          <Typography variant="body2" fontWeight={500}>Last Modified</Typography>
          <Typography variant="body2">{formatDate(container.modified)}</Typography>
        </StyledInfoRow>

        <StyledInfoRow>
          <Typography variant="body2" fontWeight={500}>Creator</Typography>
          <Typography variant="body2">Mia Adams</Typography>
        </StyledInfoRow>

        {container.seed_types && container.seed_types.length > 0 && (
          <Box>
            <Typography variant="body2" fontWeight={500} mb={1}>
              Seed Types:
            </Typography>
            <Typography variant="body2">
              {container.seed_types.join(', ')}
            </Typography>
          </Box>
        )}

        {container.notes && (
          <Box mt={2}>
            <Typography variant="h6" fontWeight={700} mb={1}>
              Notes
            </Typography>
            <Typography variant="body2">
              {container.notes}
            </Typography>
          </Box>
        )}
      </Box>
    </StyledInfoPanel>
  );
};

export default ContainerInfoPanel;