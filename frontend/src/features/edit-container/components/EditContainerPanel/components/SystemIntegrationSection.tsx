import React from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Collapse
} from '@mui/material';
import { UseEditContainerReturn } from '../../../hooks/useEditContainer';
import { StyledSection, StyledFieldRow, StyledSegmentedButton } from '../EditContainerPanel.styles';

export interface SystemIntegrationSectionProps {
  editContainerHook: UseEditContainerReturn;
  disabled?: boolean;
}

export const SystemIntegrationSection: React.FC<SystemIntegrationSectionProps> = ({
  editContainerHook,
  disabled = false
}) => {
  const {
    formData,
    state,
    actions,
    isFieldReadonly
  } = editContainerHook;

  const handleEcosystemConnectionToggle = (connected: boolean) => {
    actions.toggleEcosystemConnection(connected);
  };

  const handleEnvironmentChange = (
    system: 'fa' | 'pya' | 'aws' | 'mbai',
    environment: string
  ) => {
    const updatedSettings = {
      ...formData.ecosystemSettings,
      [system]: { environment }
    };
    actions.updateEcosystemSettings(updatedSettings);
  };

  const isEcosystemReadonly = isFieldReadonly('ecosystemConnected');

  return (
    <StyledSection>
      <Typography className="section-header">System Integration</Typography>
      
      <Box className="field-stack">
        {/* Connect to other systems */}
        <StyledFieldRow>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.ecosystemConnected}
                onChange={(e) => handleEcosystemConnectionToggle(e.target.checked)}
                disabled={disabled || isEcosystemReadonly}
                sx={{
                  '&.Mui-checked': {
                    color: '#455168'
                  }
                }}
              />
            }
            label={
              <Typography sx={{ fontSize: '14px', fontFamily: 'Inter, sans-serif', color: '#000000' }}>
                Connect to other systems after creation
              </Typography>
            }
          />
          {isEcosystemReadonly && (
            <Typography 
              variant="caption" 
              sx={{ color: '#4C4E64', fontStyle: 'italic', ml: 4 }}
            >
              (Already connected to ecosystem)
            </Typography>
          )}
        </StyledFieldRow>

        {/* Environment Settings */}
        <Collapse in={state.showEcosystemSettings}>
          <Box className="field-stack" sx={{ mt: 2 }}>
            {/* FA Environment */}
            <StyledFieldRow>
              <Typography className="field-label">FA Environment</Typography>
              <StyledSegmentedButton>
                <button
                  type="button"
                  className={`segment ${formData.ecosystemSettings.fa.environment === 'alpha' ? 'active' : 'inactive'}`}
                  onClick={() => handleEnvironmentChange('fa', 'alpha')}
                  disabled={disabled || isEcosystemReadonly}
                >
                  Alpha
                </button>
                <button
                  type="button"
                  className={`segment ${formData.ecosystemSettings.fa.environment === 'prod' ? 'active' : 'inactive'}`}
                  onClick={() => handleEnvironmentChange('fa', 'prod')}
                  disabled={disabled || isEcosystemReadonly}
                >
                  Prod
                </button>
              </StyledSegmentedButton>
            </StyledFieldRow>

            {/* PYA Environment */}
            <StyledFieldRow>
              <Typography className="field-label">PYA Environment</Typography>
              <StyledSegmentedButton>
                <button
                  type="button"
                  className={`segment ${formData.ecosystemSettings.pya.environment === 'dev' ? 'active' : 'inactive'}`}
                  onClick={() => handleEnvironmentChange('pya', 'dev')}
                  disabled={disabled || isEcosystemReadonly}
                >
                  Dev
                </button>
                <button
                  type="button"
                  className={`segment ${formData.ecosystemSettings.pya.environment === 'test' ? 'active' : 'inactive'}`}
                  onClick={() => handleEnvironmentChange('pya', 'test')}
                  disabled={disabled || isEcosystemReadonly}
                >
                  Test
                </button>
                <button
                  type="button"
                  className={`segment ${formData.ecosystemSettings.pya.environment === 'stage' ? 'active' : 'inactive'}`}
                  onClick={() => handleEnvironmentChange('pya', 'stage')}
                  disabled={disabled || isEcosystemReadonly}
                >
                  Stage
                </button>
              </StyledSegmentedButton>
            </StyledFieldRow>

            {/* AWS Environment */}
            <StyledFieldRow>
              <Typography className="field-label">AWS Environment</Typography>
              <StyledSegmentedButton>
                <button
                  type="button"
                  className={`segment ${formData.ecosystemSettings.aws.environment === 'dev' ? 'active' : 'inactive'}`}
                  onClick={() => handleEnvironmentChange('aws', 'dev')}
                  disabled={disabled || isEcosystemReadonly}
                >
                  Dev
                </button>
                <button
                  type="button"
                  className={`segment ${formData.ecosystemSettings.aws.environment === 'prod' ? 'active' : 'inactive'}`}
                  onClick={() => handleEnvironmentChange('aws', 'prod')}
                  disabled={disabled || isEcosystemReadonly}
                >
                  Prod
                </button>
              </StyledSegmentedButton>
            </StyledFieldRow>

            {/* MBAI Environment (Disabled - Prod only) */}
            <StyledFieldRow>
              <Typography className="field-label">MBAI Environment</Typography>
              <StyledSegmentedButton>
                <button
                  type="button"
                  className="segment active"
                  disabled={true}
                  style={{ 
                    backgroundColor: 'rgba(76, 78, 100, 0.12)', 
                    color: 'rgba(76, 78, 100, 0.4)' 
                  }}
                >
                  Prod
                </button>
              </StyledSegmentedButton>
              <Typography 
                variant="caption" 
                sx={{ color: '#4C4E64', fontStyle: 'italic', mt: 0.5 }}
              >
                MBAI is only available in production environment
              </Typography>
            </StyledFieldRow>
          </Box>
        </Collapse>
      </Box>
    </StyledSection>
  );
};

export default SystemIntegrationSection;