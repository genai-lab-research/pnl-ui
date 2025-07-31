import React from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Collapse
} from '@mui/material';
import { UseEditContainerReturn } from '../../../hooks/useEditContainer';
import { StyledSection, StyledFieldRow } from '../EditContainerPanel.styles';
import { SegmentedButton } from '../../../../../shared/components/ui/SegmentedButton';

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
              <SegmentedButton
                label="FA Environment"
                options={[
                  { value: 'alpha', label: 'Alpha' },
                  { value: 'prod', label: 'Prod' }
                ]}
                value={formData.ecosystemSettings.fa.environment}
                onChange={(value) => handleEnvironmentChange('fa', value)}
                disabled={disabled || isEcosystemReadonly}
              />
            </StyledFieldRow>

            {/* PYA Environment */}
            <StyledFieldRow>
              <SegmentedButton
                label="PYA Environment"
                options={[
                  { value: 'dev', label: 'Dev' },
                  { value: 'test', label: 'Test' },
                  { value: 'stage', label: 'Stage' }
                ]}
                value={formData.ecosystemSettings.pya.environment}
                onChange={(value) => handleEnvironmentChange('pya', value)}
                disabled={disabled || isEcosystemReadonly}
              />
            </StyledFieldRow>

            {/* AWS Environment */}
            <StyledFieldRow>
              <SegmentedButton
                label="AWS Environment"
                options={[
                  { value: 'dev', label: 'Dev' },
                  { value: 'prod', label: 'Prod' }
                ]}
                value={formData.ecosystemSettings.aws.environment}
                onChange={(value) => handleEnvironmentChange('aws', value)}
                disabled={disabled || isEcosystemReadonly}
              />
            </StyledFieldRow>

            {/* MBAI Environment (Disabled - Prod only) */}
            <StyledFieldRow>
              <SegmentedButton
                label="MBAI Environment"
                options={[
                  { value: 'prod', label: 'Prod', disabled: true }
                ]}
                value={formData.ecosystemSettings.mbai.environment}
                onChange={() => {}}
                disabled={true}
              />
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