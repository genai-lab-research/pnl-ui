import React from 'react';
import { Box, Typography, Switch, Link } from '@mui/material';
import { BaseInfoCard } from '../BaseInfoCard';
import { SystemSettingsCardProps } from './SystemSettingsCard.types';
import { styles } from './SystemSettingsCard.styles';

export const SystemSettingsCard: React.FC<SystemSettingsCardProps> = ({
  formData,
  isEditMode,
  onFieldChange,
}) => {
  const SettingRow = ({ 
    label, 
    value,
    isBoolean = false,
    field,
  }: { 
    label: string; 
    value: string | boolean;
    isBoolean?: boolean;
    field?: string;
  }) => (
    <Box sx={styles.settingRow}>
      <Typography sx={styles.settingLabel}>{label}</Typography>
      {isEditMode && isBoolean && field ? (
        <Switch
          checked={value as boolean}
          onChange={(e) => onFieldChange(field, e.target.checked)}
          size="small"
          sx={styles.switch}
        />
      ) : (
        <Typography sx={styles.settingValue}>
          {isBoolean ? (value ? 'Yes' : 'No') : value}
        </Typography>
      )}
    </Box>
  );

  const IntegrationRow = ({ 
    label, 
    value,
    isDisabled = false,
  }: { 
    label: string; 
    value: string;
    isDisabled?: boolean;
  }) => (
    <Box sx={styles.settingRow}>
      <Typography sx={styles.settingLabel}>{label}</Typography>
      <Link 
        href="#" 
        sx={{
          ...styles.integrationLink,
          ...(isDisabled && styles.disabledLink),
        }}
        underline="hover"
      >
        {value}
      </Link>
    </Box>
  );

  return (
    <BaseInfoCard title="System Settings">
      <Box sx={styles.content}>
        {/* Container Options Section */}
        <Typography sx={styles.sectionTitle}>Container Options</Typography>
        
        <SettingRow 
          label="Enable Shadow Service" 
          value={formData.shadowServiceEnabled}
          isBoolean={true}
          field="shadowServiceEnabled"
        />

        {/* System Integration Section */}
        <Typography sx={styles.sectionTitle}>System Integration</Typography>
        
        <SettingRow 
          label="Connect to external systems" 
          value={formData.ecosystemConnected}
          isBoolean={true}
          field="ecosystemConnected"
        />

        {/* Integration Links */}
        <IntegrationRow label="FA Integration" value="Alpha" />
        <IntegrationRow label="FA Integration" value="Dev" />
        <IntegrationRow label="AWS Environment" value="Dev" />
        <IntegrationRow label="MBAI Environment" value="Disabled" isDisabled={true} />

        {isEditMode && (
          <Box sx={styles.footer}>
            <Typography sx={styles.footerNote}>
              Note: Changes to system settings require administrator approval
            </Typography>
          </Box>
        )}
      </Box>
    </BaseInfoCard>
  );
};