import React from 'react';
import { 
  Typography, 
  Switch, 
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { ContainerFormData, ValidationError } from '../../../models/create-container.model';
import { SectionWrapper, SectionTitle, ToggleRow, FieldSpacing } from './SectionComponents.styles';

interface SettingsSectionProps {
  formData: ContainerFormData;
  availableContainers: Array<{ id: number; name: string }>;
  showVirtualSettings: boolean;
  onFieldUpdate: <K extends keyof ContainerFormData>(field: K, value: ContainerFormData[K]) => void;
  getFieldErrors: (field: string) => ValidationError[];
  hasFieldErrors: (field: string) => boolean;
  getContainerName: (containerId: number | null) => string;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  formData,
  availableContainers,
  showVirtualSettings,
  onFieldUpdate,
  getFieldErrors,
  hasFieldErrors,
  getContainerName
}) => {
  return (
    <SectionWrapper>
      <SectionTitle>Settings</SectionTitle>
      
      <ToggleRow>
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: '14px', 
            fontWeight: 400, 
            color: '#000000' 
          }}
        >
          Enable Shadow Service
        </Typography>
        <Switch
          checked={formData.shadowServiceEnabled}
          onChange={(e) => onFieldUpdate('shadowServiceEnabled', e.target.checked)}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: '#3545EE',
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: '#3545EE',
            },
          }}
        />
      </ToggleRow>

      {showVirtualSettings && (
        <>
          <FieldSpacing />
          
          <FormControl fullWidth>
            <InputLabel sx={{ fontSize: '14px', color: 'rgba(76, 78, 100, 0.6)' }}>
              Copy Environment from Container
            </InputLabel>
            <Select
              value={formData.copiedEnvironmentFrom || ''}
              label="Copy Environment from Container"
              onChange={(e) => onFieldUpdate('copiedEnvironmentFrom', Number(e.target.value) || null)}
              sx={{
                borderRadius: '6px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(76, 78, 100, 0.22)',
                }
              }}
            >
              <MenuItem value="">None</MenuItem>
              {availableContainers.map((container) => (
                <MenuItem key={container.id} value={container.id}>
                  {container.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FieldSpacing />

          <ToggleRow>
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: '14px', 
                fontWeight: 400, 
                color: '#000000' 
              }}
            >
              Run Robotics Simulation
            </Typography>
            <Switch
              checked={formData.roboticsSimulationEnabled}
              onChange={(e) => onFieldUpdate('roboticsSimulationEnabled', e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#3545EE',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#3545EE',
                },
              }}
            />
          </ToggleRow>
        </>
      )}
    </SectionWrapper>
  );
};