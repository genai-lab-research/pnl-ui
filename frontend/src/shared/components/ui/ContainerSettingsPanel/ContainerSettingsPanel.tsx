import React from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  Divider,
} from '@mui/material';
import { ContainerSettingsPanelProps } from './types';
import { StyledSettingsPanel, StyledSettingRow, StyledSectionTitle } from './ContainerSettingsPanel.styles';

/**
 * ContainerSettingsPanel component for displaying and managing container settings
 * 
 * @param props - ContainerSettingsPanel props
 * @returns JSX element
 */
export const ContainerSettingsPanel: React.FC<ContainerSettingsPanelProps> = ({
  settings,
  onSettingChange,
  readOnly = false,
  title = 'System Settings',
  ...props
}) => {
  const handleSwitchChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onSettingChange) {
      onSettingChange(key, event.target.checked);
    }
  };

  const handleSelectChange = (key: string) => (event: { target: { value: string } }) => {
    if (onSettingChange) {
      onSettingChange(key, event.target.value);
    }
  };

  return (
    <StyledSettingsPanel {...props}>
      <StyledSectionTitle variant="h6" gutterBottom>
        {title}
      </StyledSectionTitle>
      
      <Box display="flex" flexDirection="column" gap={2}>
        {/* Container Options Section */}
        <Box>
          <Typography variant="subtitle2" fontWeight={600} mb={1}>
            Container Options
          </Typography>
          <StyledSettingRow>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.shadowServiceEnabled || false}
                  onChange={handleSwitchChange('shadowServiceEnabled')}
                  disabled={readOnly}
                  size="small"
                />
              }
              label="Enable Shadow Service"
              sx={{ justifyContent: 'space-between', width: '100%', ml: 0 }}
            />
          </StyledSettingRow>
        </Box>

        <Divider />

        {/* System Integration Section */}
        <Box>
          <Typography variant="subtitle2" fontWeight={600} mb={1}>
            System Integration
          </Typography>
          
          <StyledSettingRow>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.externalSystemsConnected || false}
                  onChange={handleSwitchChange('externalSystemsConnected')}
                  disabled={readOnly}
                  size="small"
                />
              }
              label="Connect to external systems"
              sx={{ justifyContent: 'space-between', width: '100%', ml: 0 }}
            />
          </StyledSettingRow>

          <StyledSettingRow>
            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
              <Typography variant="body2">FA Integration</Typography>
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <Select
                  value={settings.faIntegration || 'Alpha'}
                  onChange={handleSelectChange('faIntegration')}
                  disabled={readOnly}
                  variant="outlined"
                >
                  <MenuItem value="Alpha">Alpha</MenuItem>
                  <MenuItem value="Beta">Beta</MenuItem>
                  <MenuItem value="Production">Production</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </StyledSettingRow>

          <StyledSettingRow>
            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
              <Typography variant="body2">AWS Environment</Typography>
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <Select
                  value={settings.awsEnvironment || 'Dev'}
                  onChange={handleSelectChange('awsEnvironment')}
                  disabled={readOnly}
                  variant="outlined"
                >
                  <MenuItem value="Dev">Dev</MenuItem>
                  <MenuItem value="Staging">Staging</MenuItem>
                  <MenuItem value="Production">Production</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </StyledSettingRow>

          <StyledSettingRow>
            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
              <Typography variant="body2">MBAI Environment</Typography>
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <Select
                  value={settings.mbaiEnvironment || 'Disabled'}
                  onChange={handleSelectChange('mbaiEnvironment')}
                  disabled={readOnly}
                  variant="outlined"
                >
                  <MenuItem value="Disabled">Disabled</MenuItem>
                  <MenuItem value="Enabled">Enabled</MenuItem>
                  <MenuItem value="Debug">Debug</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </StyledSettingRow>
        </Box>
      </Box>
    </StyledSettingsPanel>
  );
};

export default ContainerSettingsPanel;