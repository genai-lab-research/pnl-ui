import React from 'react';
import { 
  Typography, 
  Checkbox,
  Box
} from '@mui/material';
import { ContainerFormData } from '../../../models/create-container.model';
import { SectionWrapper, SectionTitle, ToggleRow, FieldSpacing } from './SectionComponents.styles';
import { SegmentedButton } from '../../../../../shared/components/ui/SegmentedButton';

interface SystemIntegrationSectionProps {
  formData: ContainerFormData;
  showEcosystemSettings: boolean;
  onEcosystemToggle: (connected: boolean) => void;
  onFieldUpdate: <K extends keyof ContainerFormData>(field: K, value: ContainerFormData[K]) => void;
}

export const SystemIntegrationSection: React.FC<SystemIntegrationSectionProps> = ({
  formData,
  showEcosystemSettings,
  onEcosystemToggle,
  onFieldUpdate
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
            <SegmentedButton
              label="FA Environment"
              options={[
                { value: 'alpha', label: 'Alpha' },
                { value: 'prod', label: 'Prod' }
              ]}
              value={formData.ecosystemSettings.fa.environment}
              onChange={(value) => handleEnvironmentChange('fa', value)}
            />

            <SegmentedButton
              label="PYA Environment"
              options={[
                { value: 'dev', label: 'Dev' },
                { value: 'test', label: 'Test' },
                { value: 'stage', label: 'Stage' }
              ]}
              value={formData.ecosystemSettings.pya.environment}
              onChange={(value) => handleEnvironmentChange('pya', value)}
            />

            <SegmentedButton
              label="AWS Environment"
              options={[
                { value: 'dev', label: 'Dev' },
                { value: 'prod', label: 'Prod' }
              ]}
              value={formData.ecosystemSettings.aws.environment}
              onChange={(value) => handleEnvironmentChange('aws', value)}
            />

            <SegmentedButton
              label="MBAI Environment"
              options={[
                { value: 'prod', label: 'Prod only', disabled: true }
              ]}
              value={formData.ecosystemSettings.mbai.environment}
              onChange={() => {}}
              disabled={true}
            />
          </Box>
        </>
      )}
    </SectionWrapper>
  );
};