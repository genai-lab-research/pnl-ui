import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button,
  Skeleton,
  Alert,
  Switch,
  FormControlLabel,
  TextField,
  Grid,
  Divider,
  Chip,
} from '@mui/material';
import { 
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  OpenInNew as ExternalLinkIcon,
  Person as PersonIcon,
  Computer as SystemIcon,
} from '@mui/icons-material';
import { useContainerSettings } from '../../hooks/useContainerSettings';
import { containerInfoSectionStyles } from './ContainerInfoSection.styles';

interface ContainerInfoSectionProps {
  containerId: number;
  canEdit?: boolean;
  canManage?: boolean;
  isLoading?: boolean;
  onRefresh: () => void;
}

export const ContainerInfoSection: React.FC<ContainerInfoSectionProps> = ({
  containerId,
  canEdit = false,
  canManage = false,
  isLoading = false,
  onRefresh,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    settings,
    isLoading: isSettingsLoading,
    hasError,
    errorMessage,
    saveSettings: updateSettings,
    refreshData: refreshSettings,
  } = useContainerSettings({
    containerId,
  });

  const [editFormData, setEditFormData] = useState({
    purpose: '',
    notes: '',
    shadowServiceEnabled: false,
    roboticsSimulationEnabled: false,
    ecosystemConnected: false,
  });

  React.useEffect(() => {
    if (settings && !isEditMode) {
      setEditFormData({
        purpose: settings.purpose || '',
        notes: settings.notes || '',
        shadowServiceEnabled: settings.shadow_service_enabled || false,
        roboticsSimulationEnabled: settings.robotics_simulation_enabled || false,
        ecosystemConnected: settings.ecosystem_connected || false,
      });
    }
  }, [settings, isEditMode]);

  const handleEditToggle = () => {
    if (isEditMode) {
      // Cancel edit - reset form
      setEditFormData({
        purpose: settings?.purpose || '',
        notes: settings?.notes || '',
        shadowServiceEnabled: settings?.shadow_service_enabled || false,
        roboticsSimulationEnabled: settings?.robotics_simulation_enabled || false,
        ecosystemConnected: settings?.ecosystem_connected || false,
      });
    }
    setIsEditMode(!isEditMode);
  };

  const handleSave = async () => {
    try {
      await updateSettings();
      setIsEditMode(false);
      onRefresh();
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRefresh = () => {
    refreshSettings();
    onRefresh();
  };

  if (isLoading || (isSettingsLoading && !settings)) {
    return (
      <Card sx={containerInfoSectionStyles.card}>
        <CardContent sx={containerInfoSectionStyles.cardContent}>
          <Box sx={containerInfoSectionStyles.header}>
            <Skeleton variant="text" width={180} height={28} />
            <Skeleton variant="rectangular" width={80} height={32} />
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" width={100} height={20} />
              <Skeleton variant="rectangular" height={40} sx={{ mt: 1 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" width={80} height={20} />
              <Skeleton variant="rectangular" height={40} sx={{ mt: 1 }} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }

  if (hasError) {
    return (
      <Card sx={containerInfoSectionStyles.card}>
        <CardContent sx={containerInfoSectionStyles.cardContent}>
          <Alert 
            severity="error" 
            action={
              <Button onClick={handleRefresh} size="small">
                Retry
              </Button>
            }
          >
            {errorMessage || 'Failed to load container settings'}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={containerInfoSectionStyles.card}>
      <CardContent sx={containerInfoSectionStyles.cardContent}>
        <Box sx={containerInfoSectionStyles.header}>
          <Typography variant="h6" sx={containerInfoSectionStyles.title}>
            Info & Settings
          </Typography>
          
          {canEdit && (
            <Box sx={containerInfoSectionStyles.actionButtons}>
              {isEditMode ? (
                <>
                  <Button
                    size="small"
                    onClick={handleEditToggle}
                    startIcon={<CancelIcon />}
                    sx={containerInfoSectionStyles.cancelButton}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    onClick={handleSave}
                    startIcon={<SaveIcon />}
                    variant="contained"
                    sx={containerInfoSectionStyles.saveButton}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <Button
                  size="small"
                  onClick={handleEditToggle}
                  startIcon={<EditIcon />}
                  variant="outlined"
                  sx={containerInfoSectionStyles.editButton}
                >
                  Edit
                </Button>
              )}
            </Box>
          )}
        </Box>

        <Grid container spacing={3}>
          {/* Container Information Column */}
          <Grid item xs={12} lg={4}>
            <Box sx={containerInfoSectionStyles.column}>
              <Typography variant="subtitle1" sx={containerInfoSectionStyles.columnTitle}>
                Container Information
              </Typography>
              
              <Box sx={containerInfoSectionStyles.fieldGroup}>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldLabel}>
                  Name
                </Typography>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldValue}>
                  {`[NO DATA] Container-${containerId}`}
                </Typography>
              </Box>

              <Box sx={containerInfoSectionStyles.fieldGroup}>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldLabel}>
                  Type
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, backgroundColor: '#E4E4E7', borderRadius: 1 }} />
                  <Typography variant="body2" sx={containerInfoSectionStyles.fieldValue}>
                    [NO DATA] Unknown Type
                  </Typography>
                </Box>
              </Box>

              <Box sx={containerInfoSectionStyles.fieldGroup}>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldLabel}>
                  Tenant
                </Typography>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldValue}>
                  {settings?.tenant_id ? `tenant-${settings.tenant_id}` : '[NO DATA] tenant-999999'}
                </Typography>
              </Box>

              <Box sx={containerInfoSectionStyles.fieldGroup}>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldLabel}>
                  Purpose
                </Typography>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldValue}>
                  {settings?.purpose || '[NO DATA] Unknown Purpose'}
                </Typography>
              </Box>

              <Box sx={containerInfoSectionStyles.fieldGroup}>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldLabel}>
                  Location
                </Typography>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldValue}>
                  {typeof settings?.location === 'string' ? settings.location : '[NO DATA] Unknown Location'}
                </Typography>
              </Box>

              <Box sx={containerInfoSectionStyles.fieldGroup}>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldLabel}>
                  Status
                </Typography>
                <Chip
                  label="NO DATA"
                  size="small"
                  sx={{
                    backgroundColor: '#FFEBEE',
                    color: '#D32F2F',
                    fontSize: '0.75rem',
                    height: 20,
                  }}
                />
              </Box>

              <Box sx={containerInfoSectionStyles.fieldGroup}>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldLabel}>
                  Created
                </Typography>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldValue}>
                  01/01/1999, 00:00
                </Typography>
              </Box>

              <Box sx={containerInfoSectionStyles.fieldGroup}>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldLabel}>
                  Last Modified
                </Typography>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldValue}>
                  01/01/1999, 00:00
                </Typography>
              </Box>

              <Box sx={containerInfoSectionStyles.fieldGroup}>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldLabel}>
                  Creator
                </Typography>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldValue}>
                  [NO DATA] Unknown Creator
                </Typography>
              </Box>

              <Box sx={containerInfoSectionStyles.fieldGroup}>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldLabel}>
                  Seed Type:
                </Typography>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldValue}>
                  [NO DATA] Unknown seed types
                </Typography>
              </Box>

              <Box sx={containerInfoSectionStyles.fieldGroup}>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldLabel}>
                  Notes
                </Typography>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldValue}>
                  {settings?.notes || '[NO DATA] No notes available'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* System Settings Column */}
          <Grid item xs={12} lg={4}>
            <Box sx={containerInfoSectionStyles.column}>
              <Typography variant="subtitle1" sx={containerInfoSectionStyles.columnTitle}>
                System Settings
              </Typography>
              
              <Box sx={containerInfoSectionStyles.fieldGroup}>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldLabel}>
                  Container Options
                </Typography>
              </Box>

              <Box sx={containerInfoSectionStyles.fieldGroup}>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldLabel}>
                  Enable Shadow Service
                </Typography>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldValue}>
                  {settings?.shadow_service_enabled !== undefined ? (settings.shadow_service_enabled ? 'Yes' : 'No') : '[NO DATA]'}
                </Typography>
              </Box>

              <Box sx={containerInfoSectionStyles.fieldGroup}>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldLabel}>
                  System Integration
                </Typography>
              </Box>

              <Box sx={containerInfoSectionStyles.fieldGroup}>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldLabel}>
                  Connect to external systems
                </Typography>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldValue}>
                  {settings?.ecosystem_connected !== undefined ? (settings.ecosystem_connected ? 'Yes' : 'No') : '[NO DATA]'}
                </Typography>
              </Box>

              <Box sx={containerInfoSectionStyles.fieldGroup}>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldLabel}>
                  FA Integration
                </Typography>
                <Typography variant="body2" sx={{ ...containerInfoSectionStyles.fieldValue, color: '#3B82F6' }}>
                  [NO DATA]
                </Typography>
              </Box>

              <Box sx={containerInfoSectionStyles.fieldGroup}>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldLabel}>
                  PYA Integration
                </Typography>
                <Typography variant="body2" sx={{ ...containerInfoSectionStyles.fieldValue, color: '#3B82F6' }}>
                  [NO DATA]
                </Typography>
              </Box>

              <Box sx={containerInfoSectionStyles.fieldGroup}>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldLabel}>
                  AWS Environment
                </Typography>
                <Typography variant="body2" sx={{ ...containerInfoSectionStyles.fieldValue, color: '#3B82F6' }}>
                  [NO DATA]
                </Typography>
              </Box>

              <Box sx={containerInfoSectionStyles.fieldGroup}>
                <Typography variant="body2" sx={containerInfoSectionStyles.fieldLabel}>
                  MBAI Environment
                </Typography>
                <Typography variant="body2" sx={{ ...containerInfoSectionStyles.fieldValue, color: '#6B7280' }}>
                  [NO DATA] Disabled
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Activity Log Column */}
          <Grid item xs={12} lg={4}>
            <Box sx={containerInfoSectionStyles.column}>
              <Typography variant="subtitle1" sx={containerInfoSectionStyles.columnTitle}>
                Activity Log
              </Typography>
              
              {/* Activity items - show placeholder data when no real data is available */}
              <Box sx={containerInfoSectionStyles.activityItem}>
                <Box sx={containerInfoSectionStyles.activityIcon}>
                  <PersonIcon sx={{ fontSize: 16, color: '#22C55E' }} />
                </Box>
                <Box sx={containerInfoSectionStyles.activityContent}>
                  <Typography variant="body2" sx={containerInfoSectionStyles.activityDescription}>
                    [NO DATA] Placeholder activity A
                  </Typography>
                  <Typography variant="caption" sx={containerInfoSectionStyles.activityMeta}>
                    Jan 01, 1999 - 00:00 AM · [NO DATA] Unknown User
                  </Typography>
                </Box>
              </Box>

              <Box sx={containerInfoSectionStyles.activityItem}>
                <Box sx={containerInfoSectionStyles.activityIcon}>
                  <SystemIcon sx={{ fontSize: 16, color: '#6B7280' }} />
                </Box>
                <Box sx={containerInfoSectionStyles.activityContent}>
                  <Typography variant="body2" sx={containerInfoSectionStyles.activityDescription}>
                    [NO DATA] Placeholder system event
                  </Typography>
                  <Typography variant="caption" sx={containerInfoSectionStyles.activityMeta}>
                    Jan 01, 1999 - 00:00 AM
                  </Typography>
                </Box>
              </Box>

              <Box sx={containerInfoSectionStyles.activityItem}>
                <Box sx={containerInfoSectionStyles.activityIcon}>
                  <PersonIcon sx={{ fontSize: 16, color: '#3B82F6' }} />
                </Box>
                <Box sx={containerInfoSectionStyles.activityContent}>
                  <Typography variant="body2" sx={containerInfoSectionStyles.activityDescription}>
                    [NO DATA] Placeholder configuration change
                  </Typography>
                  <Typography variant="caption" sx={containerInfoSectionStyles.activityMeta}>
                    Jan 01, 1999 - 00:00 AM · [NO DATA] System User 999999
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
