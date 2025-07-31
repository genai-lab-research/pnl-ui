import React from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import { UseEditContainerReturn } from '../../../hooks/useEditContainer';
import { StyledSection, StyledFieldRow } from '../EditContainerPanel.styles';

export interface SettingsSectionProps {
  editContainerHook: UseEditContainerReturn;
  disabled?: boolean;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  editContainerHook,
  disabled = false
}) => {
  const {
    formData,
    state,
    availableContainers,
    actions,
    getValidationErrorsForField,
    hasValidationErrorsForField
  } = editContainerHook;

  const handleShadowServiceToggle = (enabled: boolean) => {
    actions.updateFormField('shadowServiceEnabled', enabled);
  };

  const handleCopiedEnvironmentChange = (containerId: number | null) => {
    actions.updateFormField('copiedEnvironmentFrom', containerId);
  };

  const handleRoboticsSimulationToggle = (enabled: boolean) => {
    actions.updateFormField('roboticsSimulationEnabled', enabled);
  };

  return (
    <StyledSection>
      <Typography className="section-header">Settings</Typography>
      
      <Box className="field-stack">
        {/* Enable Shadow Service */}
        <StyledFieldRow>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography sx={{ fontSize: '14px', fontFamily: 'Inter, sans-serif', color: '#000000' }}>
              Enable Shadow Service
            </Typography>
            <Switch
              checked={formData.shadowServiceEnabled}
              onChange={(e) => handleShadowServiceToggle(e.target.checked)}
              disabled={disabled}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  '& + .MuiSwitch-track': {
                    backgroundColor: '#455168'
                  }
                }
              }}
            />
          </Box>
        </StyledFieldRow>

        {/* Virtual Container Settings */}
        {state.showVirtualSettings && (
          <>
            {/* Copy Environment from Container */}
            <StyledFieldRow>
              <FormControl 
                fullWidth 
                size="small" 
                error={hasValidationErrorsForField('copiedEnvironmentFrom')}
                disabled={disabled}
              >
                <InputLabel>Copy Environment from Container</InputLabel>
                <Select
                  value={formData.copiedEnvironmentFrom || ''}
                  onChange={(e) => handleCopiedEnvironmentChange(e.target.value as number || null)}
                  label="Copy Environment from Container"
                  sx={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {availableContainers
                    .filter(container => container.id !== formData.id)
                    .map((container) => (
                      <MenuItem key={container.id} value={container.id}>
                        {container.name}
                      </MenuItem>
                    ))}
                </Select>
                {hasValidationErrorsForField('copiedEnvironmentFrom') && (
                  <FormHelperText>
                    {getValidationErrorsForField('copiedEnvironmentFrom')[0]?.message}
                  </FormHelperText>
                )}
              </FormControl>
            </StyledFieldRow>

            {/* Run Robotics Simulation */}
            <StyledFieldRow>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography sx={{ fontSize: '14px', fontFamily: 'Inter, sans-serif', color: '#000000' }}>
                  Run Robotics Simulation
                </Typography>
                <Switch
                  checked={formData.roboticsSimulationEnabled}
                  onChange={(e) => handleRoboticsSimulationToggle(e.target.checked)}
                  disabled={disabled}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      '& + .MuiSwitch-track': {
                        backgroundColor: '#455168'
                      }
                    }
                  }}
                />
              </Box>
            </StyledFieldRow>
          </>
        )}
      </Box>
    </StyledSection>
  );
};

export default SettingsSection;