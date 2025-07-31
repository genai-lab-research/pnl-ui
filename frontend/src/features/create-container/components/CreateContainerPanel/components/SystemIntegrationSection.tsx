import React from 'react';
import { 
  Typography, 
  Checkbox,
  ToggleButton,
  ToggleButtonGroup,
  Box
} from '@mui/material';
import { ContainerFormData, ValidationError } from '../../../models/create-container.model';
import { SectionWrapper, SectionTitle, ToggleRow, FieldSpacing } from './SectionComponents.styles';

interface SystemIntegrationSectionProps {
  formData: ContainerFormData;
  showEcosystemSettings: boolean;
  onEcosystemToggle: (connected: boolean) => void;
  onFieldUpdate: <K extends keyof ContainerFormData>(field: K, value: ContainerFormData[K]) => void;
  getFieldErrors: (field: string) => ValidationError[];
  hasFieldErrors: (field: string) => boolean;
}

export const SystemIntegrationSection: React.FC<SystemIntegrationSectionProps> = ({
  formData,
  showEcosystemSettings,
  onEcosystemToggle,
  onFieldUpdate,
  getFieldErrors,
  hasFieldErrors
}) => {
  const handleEnvironmentChange = (
    system: keyof ContainerFormData['ecosystemSettings'],
    environment: string
  ) => {
    const updatedSettings = {
      ...formData.ecosystemSettings,
      [system]: { environment }
    };
    onFieldUpdate('ecosystemSettings', updatedSettings);
  };

  return (
    <SectionWrapper>
      <SectionTitle>System Integration</SectionTitle>
      
      <ToggleRow>
        <Checkbox
          checked={formData.ecosystemConnected}
          onChange={(e) => onEcosystemToggle(e.target.checked)}
          sx={{
            color: 'rgba(76, 78, 100, 0.6)',
            '&.Mui-checked': {
              color: '#3545EE',
            },
            padding: 0,
            marginRight: 1
          }}
        />
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: '14px', 
            fontWeight: 400, 
            color: '#000000',
            flex: 1
          }}
        >
          Connect to other systems after creation
        </Typography>
      </ToggleRow>

      {showEcosystemSettings && (
        <>
          <FieldSpacing />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '12px', 
                  fontWeight: 500, 
                  color: '#666666',
                  mb: 1
                }}
              >
                FA Environment
              </Typography>
              <ToggleButtonGroup
                value={formData.ecosystemSettings.fa.environment}
                exclusive
                onChange={(_, value) => value && handleEnvironmentChange('fa', value)}
                size="small"
                sx={{
                  '& .MuiToggleButton-root': {
                    fontSize: '12px',
                    padding: '4px 12px',
                    textTransform: 'none',
                    border: '1px solid rgba(76, 78, 100, 0.22)',
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(53, 69, 238, 0.1)',
                      color: '#3545EE'
                    }
                  }
                }}
              >
                <ToggleButton value="alpha">Alpha</ToggleButton>
                <ToggleButton value="prod">Prod</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '12px', 
                  fontWeight: 500, 
                  color: '#666666',
                  mb: 1
                }}
              >
                PYA Environment
              </Typography>
              <ToggleButtonGroup
                value={formData.ecosystemSettings.pya.environment}
                exclusive
                onChange={(_, value) => value && handleEnvironmentChange('pya', value)}
                size="small"
                sx={{
                  '& .MuiToggleButton-root': {
                    fontSize: '12px',
                    padding: '4px 12px',
                    textTransform: 'none',
                    border: '1px solid rgba(76, 78, 100, 0.22)',
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(53, 69, 238, 0.1)',
                      color: '#3545EE'
                    }
                  }
                }}
              >
                <ToggleButton value="dev">Dev</ToggleButton>
                <ToggleButton value="test">Test</ToggleButton>
                <ToggleButton value="stage">Stage</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '12px', 
                  fontWeight: 500, 
                  color: '#666666',
                  mb: 1
                }}
              >
                AWS Environment
              </Typography>
              <ToggleButtonGroup
                value={formData.ecosystemSettings.aws.environment}
                exclusive
                onChange={(_, value) => value && handleEnvironmentChange('aws', value)}
                size="small"
                sx={{
                  '& .MuiToggleButton-root': {
                    fontSize: '12px',
                    padding: '4px 12px',
                    textTransform: 'none',
                    border: '1px solid rgba(76, 78, 100, 0.22)',
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(53, 69, 238, 0.1)',
                      color: '#3545EE'
                    }
                  }
                }}
              >
                <ToggleButton value="dev">Dev</ToggleButton>
                <ToggleButton value="prod">Prod</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '12px', 
                  fontWeight: 500, 
                  color: '#666666',
                  mb: 1
                }}
              >
                MBAI Environment
              </Typography>
              <ToggleButtonGroup
                value={formData.ecosystemSettings.mbai.environment}
                exclusive
                disabled
                size="small"
                sx={{
                  '& .MuiToggleButton-root': {
                    fontSize: '12px',
                    padding: '4px 12px',
                    textTransform: 'none',
                    border: '1px solid rgba(76, 78, 100, 0.22)',
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(53, 69, 238, 0.1)',
                      color: '#3545EE'
                    }
                  }
                }}
              >
                <ToggleButton value="prod">Prod only</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>
        </>
      )}
    </SectionWrapper>
  );
};