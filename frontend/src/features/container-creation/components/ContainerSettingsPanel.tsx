import React, { useCallback } from 'react';
import { 
  Box, 
  Grid,
  Typography,
  FormControlLabel,
  Switch,
  Paper
} from '@mui/material';
import { ContainerFormData, ContainerFormOptions, ContainerFormErrors } from '../types';
import { Select } from '../../../shared/components/ui/Select';

interface ContainerSettingsPanelProps {
  formData: ContainerFormData;
  errors: ContainerFormErrors;
  options: ContainerFormOptions;
  onChange: (updates: Partial<ContainerFormData>) => void;
  onCopyEnvironment?: (containerId: number) => void;
}

export const ContainerSettingsPanel: React.FC<ContainerSettingsPanelProps> = ({
  formData,
  errors,
  options,
  onChange,
  onCopyEnvironment
}) => {
  const handleShadowServiceChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ shadow_service_enabled: event.target.checked });
  }, [onChange]);

  const handleCopyEnvironmentChange = useCallback(async (value: string) => {
    const containerId = value ? parseInt(value) : null;
    onChange({ 
      copied_environment_from: containerId 
    });
    
    // Copy environment settings if container is selected and callback is provided
    if (containerId && onCopyEnvironment) {
      try {
        await onCopyEnvironment(containerId);
      } catch (error) {
        console.error('Failed to copy environment:', error);
      }
    }
  }, [onChange, onCopyEnvironment]);

  const handleRoboticsSimulationChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ robotics_simulation_enabled: event.target.checked });
  }, [onChange]);

  return (
    <Box>
      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, backgroundColor: '#f8fafc' }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 2, 
                fontWeight: 600,
                color: '#333'
              }}
            >
              General Settings
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.shadow_service_enabled}
                  onChange={handleShadowServiceChange}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Enable Shadow Service
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    Shadow service provides additional monitoring and backup capabilities
                  </Typography>
                </Box>
              }
            />
          </Paper>
        </Grid>

        {/* Virtual Container Settings */}
        {formData.type === 'virtual' && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, backgroundColor: '#f0f4ff' }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 600,
                  color: '#1976d2'
                }}
              >
                Virtual Container Settings
              </Typography>

              <Grid container spacing={3}>
                {/* Copy Environment From */}
                <Grid item xs={12} md={6}>
                  <Select
                    label="Copy Environment from Container"
                    placeholder="Select a virtual container"
                    value={formData.copied_environment_from?.toString() || ''}
                    onChange={handleCopyEnvironmentChange}
                    options={[
                      { value: '', label: 'None' },
                      ...options.virtualContainers.map(container => ({
                        value: container.id.toString(),
                        label: container.name
                      }))
                    ]}
                    helperText="Select a container to copy its environment settings"
                    ariaLabel="Select container to copy environment from"
                  />
                </Grid>

                {/* Robotics Simulation */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ mt: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.robotics_simulation_enabled}
                          onChange={handleRoboticsSimulationChange}
                          color="primary"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Run Robotics Simulation
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            Enable robotics simulation for testing and development
                          </Typography>
                        </Box>
                      }
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}

        {/* Information Panel */}
        <Grid item xs={12}>
          <Box 
            sx={{ 
              p: 2, 
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: 1
            }}
          >
            <Typography variant="body2" sx={{ color: '#856404' }}>
              <strong>Note:</strong> Container settings can be modified after creation through the container management dashboard.
              {formData.type === 'virtual' && (
                <> Virtual containers provide additional simulation capabilities and can be used for testing without physical hardware.</>
              )}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
