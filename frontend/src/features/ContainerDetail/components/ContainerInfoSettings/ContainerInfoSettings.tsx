import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton, 
  Grid,
  Button,
  Collapse
} from '@mui/material';
import { Edit, ExpandMore, ExpandLess } from '@mui/icons-material';
import { ContainerInformationCard } from '../ContainerInformationCard';
import { SystemSettingsCard } from '../SystemSettingsCard';
import { RecentActivityFeed } from '../RecentActivityFeed';
import { ActivityLog } from '../../../../types/containers';
import { styles } from './ContainerInfoSettings.styles';

// Local interface to match ContainerInfo from containerApiService
interface ContainerInfo {
  id: number;
  name: string;
  type: string;
  tenant: {
    id: number;
    name: string;
  };
  location: Record<string, any>;
  status: string;
}

interface ContainerInfoSettingsProps {
  container: ContainerInfo;
  isEditMode: boolean;
  activities?: ActivityLog[];
  isLoadingActivities?: boolean;
  hasMoreActivities?: boolean;
  onLoadMoreActivities?: () => void;
  onRefreshActivities?: () => void;
  onEditModeToggle: () => void;
  onSave: (settings: {
    tenantId: number;
    purpose: string;
    location: Record<string, unknown>;
    notes: string;
    shadowServiceEnabled: boolean;
    roboticsSimulationEnabled: boolean;
    ecosystemConnected: boolean;
  }) => Promise<void>;
}

export const ContainerInfoSettings: React.FC<ContainerInfoSettingsProps> = ({
  container,
  isEditMode,
  activities = [],
  isLoadingActivities = false,
  hasMoreActivities = false,
  onLoadMoreActivities = () => {},
  onRefreshActivities = () => {},
  onEditModeToggle,
  onSave
}) => {
  const [expanded, setExpanded] = useState(true);
  const [formData, setFormData] = useState({
    tenantId: container.tenant.id,
    purpose: 'Development',
    location: container.location,
    notes: 'Primary production container for Farm A.',
    shadowServiceEnabled: false,
    roboticsSimulationEnabled: false,
    ecosystemConnected: true
  });

  const handleInputChange = (field: string, value: string | boolean | Record<string, unknown>) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    await onSave(formData);
  };


  return (
    <Paper sx={styles.root}>
      <Box sx={styles.header}>
        <Box sx={styles.titleContainer}>
          <Typography variant="h5" sx={styles.title}>
            Container Information & Settings
          </Typography>
          <IconButton 
            onClick={() => setExpanded(!expanded)}
            size="small"
            sx={styles.expandButton}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        <Button
          startIcon={<Edit />}
          onClick={onEditModeToggle}
          variant={isEditMode ? "contained" : "text"}
          size="small"
        >
          {isEditMode ? 'Cancel' : 'Edit'}
        </Button>
      </Box>

      <Collapse in={expanded}>
        <Box sx={styles.content}>
          <Grid container spacing={3}>
            {/* Container Information Card */}
            <Grid item xs={12} md={4}>
              <ContainerInformationCard
                container={container}
                isEditMode={isEditMode}
                formData={formData}
                onFieldChange={handleInputChange}
              />
            </Grid>

            {/* System Settings Card */}
            <Grid item xs={12} md={4}>
              <SystemSettingsCard
                formData={formData}
                isEditMode={isEditMode}
                onFieldChange={handleInputChange}
              />
            </Grid>

            {/* Recent Activity Feed */}
            <Grid item xs={12} md={4}>
              <RecentActivityFeed
                activities={activities}
                isLoading={isLoadingActivities}
                hasMore={hasMoreActivities}
                onLoadMore={onLoadMoreActivities}
                onRefresh={onRefreshActivities}
              />
            </Grid>
          </Grid>

          {isEditMode && (
            <Box sx={styles.actionButtons}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                onClick={onEditModeToggle}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};